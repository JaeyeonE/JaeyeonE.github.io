import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'

// Matches the field-of-view cone in FrankaRig: apex at local origin, opening
// along local +Z (the hand's forward direction), ~24° half-angle.
const CONE_NEAR = 0.14
const CONE_FAR = 0.42
const CONE_SPREAD = 0.42

let nextId = 0

function randomBoxPosition(): [number, number, number] {
  const depth = CONE_NEAR + Math.random() * (CONE_FAR - CONE_NEAR)
  const maxRadius = depth * CONE_SPREAD
  const radius = maxRadius * (0.2 + Math.random() * 0.65)
  const angle = Math.random() * Math.PI * 2
  return [radius * Math.cos(angle), radius * Math.sin(angle), depth]
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
