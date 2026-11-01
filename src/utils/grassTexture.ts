import * as THREE from 'three'
import { GROUND_RADIUS } from '../constants'

const PBR_GRASS_BASE =
  '/pbr grass/2K/Poliigon_GrassPatchyGround_4585'

/** Ground albedo map. */
export const GRASS_TEXTURE_URL = `${PBR_GRASS_BASE}_BaseColor.jpg`

export const GRASS_PBR_TEXTURES = {
  map: GRASS_TEXTURE_URL,
  normalMap: `${PBR_GRASS_BASE}_Normal.png`,
  roughnessMap: `${PBR_GRASS_BASE}_Roughness.jpg`,
  aoMap: `${PBR_GRASS_BASE}_AmbientOcclusion.jpg`,
  metalnessMap: `${PBR_GRASS_BASE}_Metallic.jpg`,
} as const

/** Approximate real-world size (m) represented by one texture repeat. */
export const GRASS_TEXTURE_WORLD_SIZE = 8

export function configureGrassTexture(
  map: THREE.Texture,
  gl?: THREE.WebGLRenderer,
): THREE.Texture {
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.colorSpace = THREE.SRGBColorSpace
  map.minFilter = THREE.LinearMipmapLinearFilter
  map.magFilter = THREE.LinearFilter
  map.generateMipmaps = true

  if (gl) {
    map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
  }

  return map
}

export type TiledPBRMaps = {
  map: THREE.Texture
  normalMap: THREE.Texture
  roughnessMap: THREE.Texture
  aoMap?: THREE.Texture
  metalnessMap?: THREE.Texture
}

export function configureTiledPBRMaps(
  maps: TiledPBRMaps,
  gl?: THREE.WebGLRenderer,
): void {
  configureGrassTexture(maps.map, gl)

  const linearMaps = [maps.normalMap, maps.roughnessMap]
  if (maps.aoMap) linearMaps.push(maps.aoMap)
  if (maps.metalnessMap) linearMaps.push(maps.metalnessMap)

  for (const tex of linearMaps) {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.colorSpace = THREE.NoColorSpace
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = true
    if (gl) {
      tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    }
  }
}

/** UV repeats for circular outfield (diameter in world units). */
export function grassGroundRepeat(): number {
  return (GROUND_RADIUS * 2) / GRASS_TEXTURE_WORLD_SIZE
}
