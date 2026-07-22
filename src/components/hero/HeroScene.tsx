import { Suspense, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { FrankaRig } from './FrankaRig'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { isWebGLAvailable } from '../../utils/webgl'

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 rounded-full border border-cloud sm:h-52 sm:w-52" />
    </div>
  )
}

export function HeroScene() {
  const reduced = useReducedMotion()
  const supported = useMemo(() => isWebGLAvailable(), [])
  // Starts false (home pose) until the cursor is actually seen over the
  // canvas, and drops back to false if it leaves.
  const pointerActive = useRef(false)

  if (!supported) {
    return <StaticFallback />
  }

  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [2.1, 0.75, 4.0], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMove={() => {
        pointerActive.current = true
      }}
      onPointerLeave={() => {
        pointerActive.current = false
      }}
    >
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#d8d8dc', 0.5]} />
      <directionalLight position={[3, 4, 2]} intensity={1.15} castShadow />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.35} />
      <Suspense fallback={null}>
        <FrankaRig reduced={reduced} pointerActive={pointerActive} />
      </Suspense>
    </Canvas>
  )
}
