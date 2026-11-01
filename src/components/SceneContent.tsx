import { Environment, PerspectiveCamera } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { GROUND_RADIUS, V1_DEFAULT_CAMERA } from '../constants'
import { SKY_HDRI } from '../constants/sky'
import { CricketOutfield } from './CricketOutfield'
import { CricketPitch } from './CricketPitch'
import { GrabCursorControls } from './GrabCursorControls'
import { WicketsAtBothEnds } from './Wicket'

export function SceneContent() {
  const sunDirection = useMemo(
    () => new THREE.Vector3(-0.55, 0.9, 0.4).normalize(),
    [],
  )

  const shadowExtent = GROUND_RADIUS + 8

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={V1_DEFAULT_CAMERA.position}
        fov={V1_DEFAULT_CAMERA.fov}
        near={0.5}
        far={500}
      />
      <GrabCursorControls />

      <fog attach="fog" args={['#b8d4ec', 85, 240]} />

      <Environment
        files={SKY_HDRI}
        background
        backgroundBlurriness={0}
        environmentIntensity={0.9}
      />

      <ambientLight intensity={0.22} />
      <hemisphereLight
        args={['#c8e4ff', '#2d4a28', 0.35]}
        position={[0, 50, 0]}
      />
      <directionalLight
        position={sunDirection.clone().multiplyScalar(80)}
        intensity={2.1}
        color="#fff6e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-shadowExtent}
        shadow-camera-right={shadowExtent}
        shadow-camera-top={shadowExtent}
        shadow-camera-bottom={-shadowExtent}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />

      <CricketOutfield />
      <CricketPitch />
      <WicketsAtBothEnds />
    </>
  )
}
