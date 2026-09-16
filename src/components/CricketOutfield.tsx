import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { GROUND_RADIUS } from '../constants'
import {
  configureTiledPBRMaps,
  GRASS_PBR_TEXTURES,
  grassGroundRepeat,
} from '../utils/grassTexture'

export function CricketOutfield() {
  const maps = useTexture(GRASS_PBR_TEXTURES)
  const { gl } = useThree()

  useEffect(() => {
    configureTiledPBRMaps(maps, gl)
    const repeat = grassGroundRepeat()
    for (const tex of Object.values(maps)) {
      tex.repeat.set(repeat, repeat)
      tex.needsUpdate = true
    }
  }, [maps, gl])

  const geometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(GROUND_RADIUS, 96)
    geo.setAttribute('uv2', geo.attributes.uv.clone())
    return geo
  }, [])

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.03, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        roughnessMap={maps.roughnessMap}
        metalnessMap={maps.metalnessMap}
        aoMap={maps.aoMap}
        aoMapIntensity={1}
        roughness={1}
        metalness={1}
        color="#ffffff"
      />
    </mesh>
  )
}
