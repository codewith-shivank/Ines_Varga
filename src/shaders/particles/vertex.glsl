uniform float uTime;
uniform float uScrollVelocity;
attribute float aScale;
attribute float aPhase;
varying float vPhase;
varying float vAlpha;

void main() {
  vPhase = aPhase;
  vec3 pos = position;

  // Subtle floating oscillation
  pos.y += sin(uTime * 0.8 + aPhase * 6.28) * 0.2;
  pos.x += cos(uTime * 0.5 + aPhase * 3.14) * 0.15;
  pos.z += uScrollVelocity * 0.001 * sin(aPhase * 3.14);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Distance attenuation
  gl_PointSize = (aScale * 14.0 / -mvPosition.z);
  vAlpha = smoothstep(20.0, 5.0, -mvPosition.z) * 0.6;
}
