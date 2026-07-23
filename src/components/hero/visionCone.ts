// Shared geometry for the field-of-view cone (FrankaRig's mesh) and the
// scan boxes (ScanBoxes.tsx) that scatter inside it — both are positioned
// in the hand's local frame (+Z forward), so they need to agree on where
// the cone starts and how it flares.

// Apex position along local +Z, roughly the midpoint of the gripper
// (between the finger mount at 0.0584 and the TCP tip at 0.1034).
export const CONE_START_Z = 0.08

// Cone length (apex to base) and half-angle spread (radius / length).
export const CONE_LENGTH = 0.25
export const CONE_SPREAD = 0.42
export const CONE_RADIUS = CONE_LENGTH * CONE_SPREAD
