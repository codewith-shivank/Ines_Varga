// Stub: Distortion Fragment Shader (Phase 6)
// Texture sampling with chromatic aberration and settling physics
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(uTexture, vUv);
}
