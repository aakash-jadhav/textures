import * as THREE from 'three'

const CHALK_COLOR = new THREE.Color('#f2ebe0')
const BASE_OPACITY = 0.84

export type CreaseFeatherAxis = 'x' | 'z'

/**
 * Chalk-like crease material: soft edges, noise density, slight translucency.
 * Feathering uses local position along the narrow axis of the crease strip.
 */
export function createChalkCreaseMaterial(
  featherAxis: CreaseFeatherAxis,
  narrowHalf: number,
  longHalf: number,
): THREE.MeshStandardMaterial {
  const narrowFeather = narrowHalf * 0.45
  const longFeather = longHalf * 0.12

  const material = new THREE.MeshStandardMaterial({
    color: CHALK_COLOR,
    roughness: 0.92,
    metalness: 0,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  })

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNarrowHalf = { value: narrowHalf }
    shader.uniforms.uNarrowFeather = { value: narrowFeather }
    shader.uniforms.uLongHalf = { value: longHalf }
    shader.uniforms.uLongFeather = { value: longFeather }
    shader.uniforms.uBaseOpacity = { value: BASE_OPACITY }
    shader.uniforms.uFeatherOnX = { value: featherAxis === 'x' ? 1 : 0 }

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
varying vec3 vCreaseLocalPos;
varying vec3 vCreaseLocalNormal;`,
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
vCreaseLocalPos = position;
vCreaseLocalNormal = normal;`,
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
varying vec3 vCreaseLocalPos;
varying vec3 vCreaseLocalNormal;
uniform float uNarrowHalf;
uniform float uNarrowFeather;
uniform float uLongHalf;
uniform float uLongFeather;
uniform float uBaseOpacity;
uniform float uFeatherOnX;

float creaseAxisFade(float along, float halfSize, float feather) {
  float edgeStart = max(halfSize - feather, 0.0);
  return 1.0 - smoothstep(edgeStart, halfSize, along);
}

float creaseHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}`,
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
float topFace = step(0.85, abs(vCreaseLocalNormal.y));
float narrowAlong = uFeatherOnX > 0.5 ? abs(vCreaseLocalPos.x) : abs(vCreaseLocalPos.z);
float longAlong = uFeatherOnX > 0.5 ? abs(vCreaseLocalPos.z) : abs(vCreaseLocalPos.x);
float edgeAlpha =
  creaseAxisFade(narrowAlong, uNarrowHalf, uNarrowFeather) *
  creaseAxisFade(longAlong, uLongHalf, uLongFeather);
vec2 noiseCoord = vCreaseLocalPos.xz * 42.0;
float n = creaseHash(noiseCoord) * 0.55 + creaseHash(noiseCoord * 2.1 + 3.7) * 0.45;
float density = mix(0.82, 1.0, n);
float chalkAlpha = topFace * edgeAlpha * density * uBaseOpacity;
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * mix(0.94, 1.02, n), 0.35);
diffuseColor.a *= chalkAlpha;`,
    )
  }

  material.customProgramCacheKey = () =>
    `chalk-crease-${featherAxis}-${narrowHalf}-${longHalf}`

  return material
}
