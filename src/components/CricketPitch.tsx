import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { PITCH_LENGTH, PITCH_WIDTH } from '../constants'
import { configureTiledPBRMaps } from '../utils/grassTexture'
import {
  PITCH_PBR_TEXTURES,
  pitchTextureRepeat,
} from '../utils/pitchTexture'
import {
  createChalkCreaseMaterial,
  type CreaseFeatherAxis,
} from '../utils/creaseMaterial'

const CREASE = 0.04
const POPPING_CREASE_OFFSET = 1.22
/** Gap between pitch boundary and outer edge of crease markings. */
const CREASE_EDGE_MARGIN = 0.18

function CreaseLine({
  position,
  size,
  featherAxis,
}: {
  position: [number, number, number]
  size: [number, number, number]
  featherAxis: CreaseFeatherAxis
}) {
  const narrowHalf = size[featherAxis === 'x' ? 0 : 2] / 2
  const longHalf = size[featherAxis === 'x' ? 2 : 0] / 2
  const material = useMemo(
    () => createChalkCreaseMaterial(featherAxis, narrowHalf, longHalf),
    [featherAxis, narrowHalf, longHalf],
  )

  return (
    <mesh position={position} castShadow receiveShadow material={material}>
      <boxGeometry args={size} />
    </mesh>
  )
}

export function CricketPitch() {
  const maps = useTexture(PITCH_PBR_TEXTURES)
  const { gl } = useThree()

  useEffect(() => {
    configureTiledPBRMaps(maps, gl)
    const repeat = pitchTextureRepeat()
    for (const tex of Object.values(maps)) {
      tex.repeat.set(repeat.x, repeat.y)
      tex.needsUpdate = true
    }
  }, [maps, gl])

  const pitchGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(PITCH_WIDTH, PITCH_LENGTH)
    geo.setAttribute('uv2', geo.attributes.uv.clone())
    return geo
  }, [])

  const halfL = PITCH_LENGTH / 2
  const halfW = PITCH_WIDTH / 2
  const y = 0.015
  const creaseSpanX = PITCH_WIDTH - 2 * CREASE_EDGE_MARGIN
  const creaseSpanZ = PITCH_LENGTH - 2 * CREASE_EDGE_MARGIN

  return (
    <group>
      <mesh
        geometry={pitchGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          map={maps.map}
          normalMap={maps.normalMap}
          roughnessMap={maps.roughnessMap}
          aoMap={maps.aoMap}
          aoMapIntensity={0.85}
          roughness={1}
          metalness={0}
          color="#ffffff"
        />
      </mesh>

      {/* Return creases (along pitch length), inset from pitch edges */}
      <CreaseLine
        position={[
          -halfW + CREASE_EDGE_MARGIN + CREASE / 2,
          y + 0.002,
          0,
        ]}
        size={[CREASE, 0.004, creaseSpanZ]}
        featherAxis="x"
      />
      <CreaseLine
        position={[
          halfW - CREASE_EDGE_MARGIN - CREASE / 2,
          y + 0.002,
          0,
        ]}
        size={[CREASE, 0.004, creaseSpanZ]}
        featherAxis="x"
      />

      {/* Bowling + popping creases at each end */}
      {[-1, 1].map((sign) => {
        const bowlingZ =
          sign * (halfL - CREASE_EDGE_MARGIN - CREASE / 2)
        return (
          <group key={sign}>
            <CreaseLine
              position={[0, y + 0.003, bowlingZ]}
              size={[creaseSpanX, 0.004, CREASE]}
              featherAxis="z"
            />
            <CreaseLine
              position={[
                0,
                y + 0.003,
                bowlingZ - sign * POPPING_CREASE_OFFSET,
              ]}
              size={[creaseSpanX, 0.004, CREASE]}
              featherAxis="z"
            />
          </group>
        )
      })}
    </group>
  )
}
