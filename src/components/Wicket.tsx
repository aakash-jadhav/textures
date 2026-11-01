import { useMemo } from 'react'
import {
  BAIL_DIAMETER,
  BAIL_LENGTH,
  PITCH_LENGTH,
  STUMP_DIAMETER,
  STUMP_HEIGHT,
  WICKET_WIDTH,
} from '../constants'

type WicketProps = {
  position: [number, number, number]
}

const PLASTIC = {
  color: '#f4f7fa',
  roughness: 0.22,
  metalness: 0,
  clearcoat: 0.55,
  clearcoatRoughness: 0.2,
} as const

function PlasticMaterial() {
  return (
    <meshPhysicalMaterial
      color={PLASTIC.color}
      roughness={PLASTIC.roughness}
      metalness={PLASTIC.metalness}
      clearcoat={PLASTIC.clearcoat}
      clearcoatRoughness={PLASTIC.clearcoatRoughness}
    />
  )
}

function Stump({ x }: { x: number }) {
  const radius = STUMP_DIAMETER / 2
  const topRadius = radius * 0.92
  const capY = STUMP_HEIGHT

  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, STUMP_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[topRadius, radius, STUMP_HEIGHT, 28]} />
        <PlasticMaterial />
      </mesh>
      <mesh position={[0, capY, 0]} castShadow>
        <sphereGeometry
          args={[topRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <PlasticMaterial />
      </mesh>
    </group>
  )
}

function Bail({ side }: { side: -1 | 1 }) {
  const gap = WICKET_WIDTH / 2 - STUMP_DIAMETER / 2
  const x = side * (gap / 2)
  const y = STUMP_HEIGHT + BAIL_DIAMETER * 0.55
  const endR = BAIL_DIAMETER * 0.72
  const midR = BAIL_DIAMETER * 0.42
  const endLen = BAIL_LENGTH * 0.22
  const midLen = BAIL_LENGTH * 0.56
  const endOffset = (midLen + endLen) / 2

  return (
    <group position={[x, y, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[midR, midR, midLen, 16]} />
        <PlasticMaterial />
      </mesh>
      {[-1, 1].map((end) => (
        <mesh key={end} position={[0, end * endOffset, 0]} castShadow>
          <cylinderGeometry args={[endR, endR, endLen, 16]} />
          <PlasticMaterial />
        </mesh>
      ))}
    </group>
  )
}

export function Wicket({ position }: WicketProps) {
  const stumpOffsets = useMemo(() => {
    const half = WICKET_WIDTH / 2 - STUMP_DIAMETER / 2
    return [-half, 0, half]
  }, [])

  return (
    <group position={position}>
      {stumpOffsets.map((x) => (
        <Stump key={x} x={x} />
      ))}
      <Bail side={-1} />
      <Bail side={1} />
    </group>
  )
}

export function WicketsAtBothEnds() {
  const halfL = PITCH_LENGTH / 2
  return (
    <>
      <Wicket position={[0, 0, halfL]} />
      <Wicket position={[0, 0, -halfL]} />
    </>
  )
}
