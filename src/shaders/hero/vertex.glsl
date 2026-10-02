// Stub: Hero Vertex Shader (Phase 5)
// Noise-to-signal vertex displacement driven by uScroll and uTime
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
