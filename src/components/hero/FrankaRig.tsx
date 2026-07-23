import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useFrankaModel } from './useFrankaModel'
import { ScanBoxes } from './ScanBoxes'

const RAD90 = Math.PI / 2

// Rest-pose angles for the joints we don't actuate.
const Q3_REST = 0
const Q5_REST = 0

// Home pose (cursor not detected / hasn't moved yet): the joints we do
// actuate settle here instead of guessing a target from a stale pointer.
const HOME = { j1: 0, j2: -0.5, j4: -2.05, j6: 1.65, j7: 0.78 }

// Per-joint rotation limits — tight bands around the home pose rather than
// the joints' full mechanical range, so the arm leans toward the cursor
// without unfolding into a dramatically different (and visually unstable)
// silhouette. Widest on joint1 (yaw reads fine at any angle); narrowest on
// joint6 (wrist), which is closest to the end effector and so swings the
// most per degree of target movement — a wide range there is what made it
// look like it was flailing.
const LIMITS = {
  j1: [-0.8, 0.8],
  j2: [-0.9, -0.15],
  j4: [-2.5, -1.6],
  j6: [1.2, 2.1],
} as const

// Approximate finger mount (not read from the URDF — see note in JSX below).
const FINGER_OFFSET = 0.04

// Field-of-view cone (see ScanBoxes.tsx, which shares this same shape to
// scatter its boxes inside it).
const CONE_LENGTH = 0.5
const CONE_RADIUS = 0.21

const { damp, clamp } = THREE.MathUtils

// Scratch objects reused every frame instead of allocating (CCD runs ~60x/s).
const _targetWorld = new THREE.Vector3()
const _jointPos = new THREE.Vector3()
const _effPos = new THREE.Vector3()
const _worldQuat = new THREE.Quaternion()
const _axis = new THREE.Vector3()
const _toEff = new THREE.Vector3()
const _toTarget = new THREE.Vector3()
const _cross = new THREE.Vector3()
const _camDir = new THREE.Vector3()
const _rayDir = new THREE.Vector3()
const _ray = new THREE.Ray()
const _plane = new THREE.Plane()

type RigProps = {
  reduced: boolean
  pointerActive: React.MutableRefObject<boolean>
}

/**
 * The official Franka arm meshes (see useFrankaModel), assembled using the
 * real joint offsets from franka_description's kinematics.yaml.
 *
 * The end effector is driven by a small CCD (Cyclic Coordinate Descent) IK
 * solver toward a 3D point sitting exactly on the cursor's ray (a plane
 * facing the camera, at the end effector's current depth) — so the fingertip
 * actually converges on the cursor position on screen, not just a rough
 * heuristic reach. joint1/2/4/6 participate in the solve; joint7 is a small
 * cosmetic wrist roll. When the pointer hasn't been seen yet (or has left
 * the canvas), everything eases back to a fixed home pose instead.
 */
export function FrankaRig({ reduced, pointerActive }: RigProps) {
  const model = useFrankaModel()
  const pointer = useThree((state) => state.pointer)
  const camera = useThree((state) => state.camera)
  const canvasWidth = useThree((state) => state.size.width)
  // On narrow (mobile) canvases there's no room to offset the rig toward the
  // right without pushing it off-screen — keep it centered there instead.
  const baseX = canvasWidth < 700 ? 0 : 1.3

  const joint1 = useRef<THREE.Group>(null!)
  const joint2 = useRef<THREE.Group>(null!)
  const joint4 = useRef<THREE.Group>(null!)
  const joint6 = useRef<THREE.Group>(null!)
  const joint7 = useRef<THREE.Group>(null!)
  const endEffector = useRef<THREE.Group>(null!)
  const clock = useRef(0)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    clock.current += delta

    if (!pointerActive.current) {
      // No cursor yet (or it left the canvas): rather than freezing in the
      // home pose, slowly sweep the base and wrist as if searching the
      // room — "active vision" idling, not a dead robot.
      const sweepJ1 = reduced ? 0 : Math.sin(clock.current * 0.35) * 0.55
      const sweepJ6 = reduced ? 0 : Math.sin(clock.current * 0.27 + 1.4) * 0.35
      if (joint1.current) joint1.current.rotation.z = damp(joint1.current.rotation.z, HOME.j1 + sweepJ1, 3, delta)
      if (joint2.current) joint2.current.rotation.z = damp(joint2.current.rotation.z, HOME.j2, 4, delta)
      if (joint4.current) joint4.current.rotation.z = damp(joint4.current.rotation.z, HOME.j4, 4, delta)
      if (joint6.current) joint6.current.rotation.z = damp(joint6.current.rotation.z, HOME.j6 + sweepJ6, 3, delta)
      if (joint7.current) joint7.current.rotation.z = damp(joint7.current.rotation.z, HOME.j7, 4, delta)
      return
    }

    // Cosmetic wrist roll, independent of the IK solve.
    if (joint7.current) {
      const target = HOME.j7 + clamp(pointer.x, -1, 1) * 0.3
      joint7.current.rotation.z = damp(joint7.current.rotation.z, target, 3, delta)
    }

    if (!endEffector.current) return

    // Target = the point on the cursor's ray that lies on a camera-facing
    // plane at the end effector's current depth, so it projects back to
    // exactly the cursor's screen position.
    endEffector.current.getWorldPosition(_effPos)
    camera.getWorldDirection(_camDir)
    const dist = camera.position.distanceTo(_effPos)
    _targetWorld.copy(camera.position).addScaledVector(_camDir, dist)
    _plane.setFromNormalAndCoplanarPoint(_camDir, _targetWorld)

    // Clamp how far up/down the cursor can push the target — near the top
    // of the frame this used to send the shoulder past a natural limit and
    // fold the arm backward.
    const ndcX = clamp(pointer.x, -1, 1)
    const ndcY = clamp(pointer.y, -0.6, 0.6)
    _rayDir.set(ndcX, ndcY, 0.5).unproject(camera).sub(camera.position).normalize()
    _ray.set(camera.position, _rayDir)
    if (!_ray.intersectPlane(_plane, _targetWorld)) return

    const MAX_STEP = 0.02
    const ccdStep = (joint: THREE.Group | null, limit?: readonly [number, number]) => {
      if (!joint) return
      joint.getWorldPosition(_jointPos)
      joint.getWorldQuaternion(_worldQuat)
      _axis.set(0, 0, 1).applyQuaternion(_worldQuat).normalize()
      endEffector.current!.getWorldPosition(_effPos)

      _toEff.copy(_effPos).sub(_jointPos)
      _toEff.addScaledVector(_axis, -_toEff.dot(_axis))
      _toTarget.copy(_targetWorld).sub(_jointPos)
      _toTarget.addScaledVector(_axis, -_toTarget.dot(_axis))

      if (_toEff.lengthSq() < 1e-6 || _toTarget.lengthSq() < 1e-6) return
      _toEff.normalize()
      _toTarget.normalize()

      let angle = Math.acos(clamp(_toEff.dot(_toTarget), -1, 1))
      _cross.crossVectors(_toEff, _toTarget)
      const sign = _axis.dot(_cross) >= 0 ? 1 : -1
      angle *= sign

      const step = clamp(angle, -MAX_STEP, MAX_STEP)
      let next = joint.rotation.z + step
      if (limit) next = clamp(next, limit[0], limit[1])
      joint.rotation.z = next
    }

    // Wrist to base — standard CCD order, one pass per joint per frame. A
    // small MAX_STEP already makes this converge gradually over several
    // frames rather than snapping, which reads as a slower, calmer reach.
    ccdStep(joint6.current, LIMITS.j6)
    ccdStep(joint4.current, LIMITS.j4)
    ccdStep(joint2.current, LIMITS.j2)
    ccdStep(joint1.current, LIMITS.j1)
  })

  return (
    <group position={[baseX, -1.5, 0]} scale={2.86} rotation={[0, -RAD90, 0]}>
      {/* The arm chain is built in the URDF's native Z-up frame (matching
          kinematics.yaml); this single rotation converts the whole assembled
          rig to three.js's Y-up frame, instead of per-mesh (see useFrankaModel). */}
      <group rotation={[-RAD90, 0, 0]}>
        <primitive object={model.link0} />

        {/* joint1: base -> link1, translate z=0.333, rotate about Z (q1, base yaw) */}
        <group position={[0, 0, 0.333]}>
          <group ref={joint1}>
            <primitive object={model.link1} />

            {/* joint2 frame (rotate -90 X), then q2 (shoulder, interactive) */}
            <group rotation={[-RAD90, 0, 0]}>
              <group ref={joint2}>
                <primitive object={model.link2} />

                {/* joint3 frame (translate, rotate +90 X), q3 fixed at 0 */}
                <group position={[0, -0.316, 0]} rotation={[RAD90, 0, 0]}>
                  <group rotation={[0, 0, Q3_REST]}>
                    <primitive object={model.link3} />

                    {/* joint4 frame, then q4 (elbow, interactive) */}
                    <group position={[0.0825, 0, 0]} rotation={[RAD90, 0, 0]}>
                      <group ref={joint4}>
                        <primitive object={model.link4} />

                        {/* joint5 frame, q5 fixed at 0 */}
                        <group position={[-0.0825, 0.384, 0]} rotation={[-RAD90, 0, 0]}>
                          <group rotation={[0, 0, Q5_REST]}>
                            <primitive object={model.link5} />

                            {/* joint6 frame, then q6 (wrist, interactive) */}
                            <group rotation={[RAD90, 0, 0]}>
                              <group ref={joint6}>
                                <primitive object={model.link6} />

                                {/* joint7 frame, then q7 (wrist roll, interactive) */}
                                <group position={[0.088, 0, 0]} rotation={[RAD90, 0, 0]}>
                                  <group ref={joint7}>
                                    <primitive object={model.link7} />

                                    {/* flange -> hand, translate z=0.107, mount rotation -45deg */}
                                    <group position={[0, 0, 0.107]} rotation={[0, 0, -Math.PI / 4]}>
                                      <primitive object={model.hand} />

                                      {/* Finger mount offset is approximate (not read from
                                          the URDF finger-joint origin) — good enough at this scale. */}
                                      <group position={[FINGER_OFFSET, 0, 0.0584]}>
                                        <primitive object={model.fingerA} />
                                      </group>
                                      <group position={[-FINGER_OFFSET, 0, 0.0584]} rotation={[0, 0, Math.PI]}>
                                        <primitive object={model.fingerB} />
                                      </group>

                                      {/* End-effector marker (TCP offset per franka_hand's default
                                          tcp_xyz) — invisible, used only as an IK target reference. */}
                                      <group ref={endEffector} position={[0, 0, 0.1034]} />

                                      {/* Field-of-view cone: a translucent "beam" standing in for an
                                          eye-in-hand camera, without modeling an actual camera body.
                                          Apex near the hand, opening forward along local +Z — see the
                                          derivation note above for how the rotation gets it that way. */}
                                      <mesh position={[0, 0, CONE_LENGTH / 2]} rotation={[-RAD90, 0, 0]}>
                                        <cylinderGeometry args={[0, CONE_RADIUS, CONE_LENGTH, 28, 1, true]} />
                                        <meshBasicMaterial
                                          color="#8f8f96"
                                          transparent
                                          opacity={0.16}
                                          side={THREE.DoubleSide}
                                          depthWrite={false}
                                        />
                                      </mesh>
                                      {/* Rim outline for definition against a light background. */}
                                      <mesh position={[0, 0, CONE_LENGTH / 2]} rotation={[-RAD90, 0, 0]}>
                                        <cylinderGeometry args={[0, CONE_RADIUS, CONE_LENGTH, 28, 1, true]} />
                                        <meshBasicMaterial
                                          color="#5c5c64"
                                          transparent
                                          opacity={0.2}
                                          wireframe
                                          depthWrite={false}
                                        />
                                      </mesh>
                                      <ScanBoxes reduced={reduced} />
                                    </group>
                                  </group>
                                </group>
                              </group>
                            </group>
                          </group>
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      <ContactShadows position={[0, -0.001, 0]} opacity={0.28} scale={2.6} blur={2.2} far={1} color="#000000" />
    </group>
  )
}
