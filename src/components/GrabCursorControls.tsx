import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MOUSE, TOUCH } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { GROUND_RADIUS } from '../constants'

export function GrabCursorControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { gl } = useThree()

  useEffect(() => {
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
  }, [gl])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      enablePan
      enableZoom
      enableRotate
      screenSpacePanning
      maxPolarAngle={Math.PI / 2.05}
      minDistance={6}
      maxDistance={GROUND_RADIUS * 2.8}
      target={[0, 0, 0]}
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
