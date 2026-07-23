import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { CONE_START_Z, CONE_LENGTH, CONE_SPREAD } from './visionCone'

// Boxes spawn between these two fractions of the cone's depth (from apex to
// base), so they never sit right on the apex point or right at the rim.
const NEAR_FRAC = 0.3
const FAR_FRAC = 0.9

let nextId = 0

function randomBoxPosition(): [number, number, number] {
  const depthFromApex = CONE_LENGTH * (NEAR_FRAC + Math.random() * (FAR_FRAC - NEAR_FRAC))
  const maxRadius = depthFromApex * CONE_SPREAD
  const radius = maxRadius * (0.2 + Math.random() * 0.65)
  const angle = Math.random() * Math.PI * 2
  return [radius * Math.cos(angle), radius * Math.sin(angle), CONE_START_Z + depthFromApex]
}

type Box = { id: number; position: [number, number, number] }

/**
 * Small "detection blip" boxes that fade in/out at random points inside the
 * vision cone, as if the eye-in-hand camera were spotting things while it
 * scans — decorative, not real detections. Skipped under reduced motion.
 */
export function ScanBoxes({ reduced }: { reduced: boolean }) {
  const [boxes, setBoxes] = useState<Box[]>([])

  useEffect(() => {
    if (reduced) return
    let alive = true
    const timeouts: number[] = []

    const spawn = () => {
      if (!alive) return
      const id = nextId++
      setBoxes((prev) => [...prev, { id, position: randomBoxPosition() }])
      timeouts.push(
        window.setTimeout(() => {
          setBoxes((prev) => prev.filter((b) => b.id !== id))
        }, 2200),
      )
      timeouts.push(window.setTimeout(spawn, 1400 + Math.random() * 1600))
    }

    timeouts.push(window.setTimeout(spawn, 900))

    return () => {
      alive = false
      timeouts.forEach(clearTimeout)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <>
      {boxes.map((b) => (
        <Html key={b.id} position={b.position} center zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
          <div className="scan-box" />
        </Html>
      ))}
    </>
  )
}
