import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MOUSE, TOUCH } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { GROUND_RADIUS, V1_DEFAULT_CAMERA } from '../constants'

type GrabCursorControlsProps = {
  enabled?: boolean
  target?: [number, number, number]
  minDistance?: number
  maxDistance?: number
}

export function GrabCursorControls({
  enabled = true,
  target = V1_DEFAULT_CAMERA.target,
  minDistance = 6,
  maxDistance = GROUND_RADIUS * 2.8,
}: GrabCursorControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { gl } = useThree()

  useEffect(() => {
    if (!enabled) return

    const canvas = gl.domElement
    canvas.style.cursor = 'grab'

    const onDown = () => {
      canvas.style.cursor = 'grabbing'
    }
    const onUp = () => {
      canvas.style.cursor = 'grab'
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onUp)

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onUp)
      canvas.style.cursor = ''
    }
  }, [gl, enabled])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault={enabled}
      enabled={enabled}
      enableDamping
      dampingFactor={0.06}
      enablePan
      enableZoom
      enableRotate
      screenSpacePanning
      maxPolarAngle={Math.PI / 2.05}
      minDistance={minDistance}
      maxDistance={maxDistance}
      target={target}
      mouseButtons={{
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.PAN,
      }}
      touches={{
        ONE: TOUCH.ROTATE,
        TWO: TOUCH.DOLLY_PAN,
      }}
    />
  )
}
