import { Canvas } from '@react-three/fiber'
import { useEnvironment, useTexture } from '@react-three/drei'
import { Suspense } from 'react'
import { ACESFilmicToneMapping } from 'three'
import { SceneContent } from './components/SceneContent'
import { SKY_HDRI } from './constants/sky'
import { GRASS_PBR_TEXTURES } from './utils/grassTexture'
import { PITCH_PBR_TEXTURES } from './utils/pitchTexture'

useTexture.preload([
  ...Object.values(GRASS_PBR_TEXTURES),
  ...Object.values(PITCH_PBR_TEXTURES),
])
useEnvironment.preload({ files: SKY_HDRI })

function App() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: 'high-performance',
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}

export default App
