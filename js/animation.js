console.log("Animation fuite_air chargée!!");


const texture = new THREE.TextureLoader().load("assets/wind.png");
const material = new THREE.ShaderMaterial({
  uniforms: {
    map: { value: texture },
    progress: { value: 0.0 } // 0 = invisible, 1 = visible
  },
  transparent: true,
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
fragmentShader: `
  uniform sampler2D map;
  uniform float progress;
  varying vec2 vUv;

  void main() {

    vec4 color = texture2D(map, vUv);

    // ✅ largeur de la zone de transition
    float edge = 0.05;

    // ✅ effet de révélation douce
    float alpha = smoothstep(progress - edge, progress, vUv.x);

    // ✅ appliquer l'alpha
    gl_FragColor = vec4(color.rgb, color.a * alpha);
  }
`
});

const sprite = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 1000),
  material
);

function animateReveal() {
  requestAnimationFrame(animateReveal);

  if (material.uniforms.progress.value < 1) {
    material.uniforms.progress.value += 0.01;
  }
}

animateReveal();

sprite.position.set(0, 0, -3000);
pano1.add(sprite);
