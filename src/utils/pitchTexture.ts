import { PITCH_LENGTH, PITCH_WIDTH } from '../constants'

const PITCH_BASE = '/pitch/Ground026_2K-PNG'

export const PITCH_PBR_TEXTURES = {
  map: `${PITCH_BASE}_Color.png`,
  normalMap: `${PITCH_BASE}_NormalGL.png`,
  roughnessMap: `${PITCH_BASE}_Roughness.png`,
  aoMap: `${PITCH_BASE}_AmbientOcclusion.png`,
} as const

/** Meters per texture tile (AmbientCG ground materials ~2 m). */
export const PITCH_TEXTURE_TILE_SIZE = 2

export function pitchTextureRepeat(): { x: number; y: number } {
  return {
    x: PITCH_WIDTH / PITCH_TEXTURE_TILE_SIZE,
    y: PITCH_LENGTH / PITCH_TEXTURE_TILE_SIZE,
  }
}
