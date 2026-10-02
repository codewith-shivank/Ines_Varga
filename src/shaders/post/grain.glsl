// Stub: Film Grain Fragment Shader (Phase 1 / Optional Post)
// Simplex/Hash procedural film grain
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float grain = (random(uv + uTime * 0.05) - 0.5) * uIntensity;
  gl_FragColor = vec4(vec3(grain), 1.0);
}
