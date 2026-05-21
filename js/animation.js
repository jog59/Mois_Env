console.log("Animation fuite_air chargée");


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

    float edge = 0.05;

    // ✅ apparition gauche → droite
    float alpha = smoothstep(progress, progress + edge, vUv.x);

    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color.rgb, color.a * alpha);
  }
`
});

const sprite = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 1000),
  material
);

let direction = 1; // 1 = apparition, -1 = disparition

function animateReveal() {
  requestAnimationFrame(animateReveal);
  


  material.uniforms.progress.value += 0.01 * direction;

  if (material.uniforms.progress.value >= 1) {
    direction = -1;
  }

  if (material.uniforms.progress.value <= 0) {
    direction = 1;
  }
}

animateReveal();

sprite.position.set(4600, -1350, -1300);
sprite.lookAt(viewer.camera.position);
sprite.scale.set(0.25, 0.25, 1);


pano1.add(sprite);
