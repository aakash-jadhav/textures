/** ICC standard pitch: 22 yards × 10 feet (meters). */
export const PITCH_LENGTH = 20.12
export const PITCH_WIDTH = 3.05

/** Playing area radius (~130 m boundary diameter at international grounds). */
export const GROUND_RADIUS = 65

/** Low end-on view down the pitch (+Z toward center). */
export const V1_DEFAULT_CAMERA = {
  position: [0, 2.4, 49] as [number, number, number],
  fov: 42,
  target: [0, 0, 0] as [number, number, number],
}

/** ICC stump height 28 in. */
export const STUMP_HEIGHT = 0.711
export const STUMP_DIAMETER = 0.038
/** Outer stump-to-stump width 9 in. */
export const WICKET_WIDTH = 0.229
export const BAIL_LENGTH = 0.111
export const BAIL_DIAMETER = 0.011

