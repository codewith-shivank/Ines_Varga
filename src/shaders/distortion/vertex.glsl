// Stub: Distortion Vertex Shader (Phase 6)
// Wave displacement for project image hover and scroll speed
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
