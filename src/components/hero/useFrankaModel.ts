import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js'
import * as THREE from 'three'

// Official Franka Emika arm meshes (FER / Panda), Apache-2.0 licensed.
// Source: https://github.com/frankaemika/franka_description — see
// public/models/franka/LICENSE and NOTICE.
const LINK_FILES = ['link0', 'link1', 'link2', 'link3', 'link4', 'link5', 'link6', 'link7', 'hand', 'finger'] as const
const BASE_PATH = '/models/franka/'

const ARM_COLOR = '#f2f2f4'
const BASE_COLOR = '#232326'

function recolor(scene: THREE.Object3D, color: string) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.08 })
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (mesh.isMesh) {
      mesh.material = material
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
}

// ColladaLoader bakes a Z-up -> Y-up correction into each scene's own
// rotation (since these files declare <up_axis>Z_UP</up_axis>). We want to
// keep every link in its native Z-up (URDF) frame so the joint offsets below
// — taken straight from franka_description's kinematics.yaml — compose
// correctly, and do a single Z-up -> Y-up conversion on the whole assembled
// rig instead (see the outer group's rotation in FrankaRig).
function clearUpAxisCorrection(scene: THREE.Object3D) {
  scene.rotation.set(0, 0, 0)
}

export function useFrankaModel() {
  const urls = useMemo(() => LINK_FILES.map((f) => `${BASE_PATH}${f}.dae`), [])
  const results = useLoader(ColladaLoader, urls)

  return useMemo(() => {
    const [link0, link1, link2, link3, link4, link5, link6, link7, hand, finger] = results.map(
      (r) => r!.scene.clone(true),
    )
    const fingerA = finger
    const fingerB = finger.clone(true)

    for (const l of [link0, link1, link2, link3, link4, link5, link6, link7, hand, fingerA, fingerB]) {
      clearUpAxisCorrection(l)
    }

    recolor(link0, BASE_COLOR)
    for (const l of [link1, link2, link3, link4, link5, link6, link7, hand, fingerA, fingerB]) {
      recolor(l, ARM_COLOR)
    }

    return { link0, link1, link2, link3, link4, link5, link6, link7, hand, fingerA, fingerB }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results])
}
