uniform vec3 uColor;
varying float vPhase;
varying float vAlpha;

void main() {
  // Circular soft point
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  float strength = pow(1.0 - (dist * 2.0), 2.0);
  vec3 col = uColor + vec3(0.1, 0.15, 0.3) * sin(vPhase * 3.14);

  gl_FragColor = vec4(col, strength * vAlpha);
}
