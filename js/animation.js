console.log("Animation fuite_air chargée");

// ✅ texture
const texture = new THREE.TextureLoader().load("assets/vent2.png");


texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping


// ✅ shader correct
const material = new THREE.ShaderMaterial({
  uniforms: {
    map: { value: texture },
    time: { value: 0 }
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
    uniform float time;
    varying vec2 vUv;

    void main() {

      vec2 uv = vUv;

      // ✅ flux vers la droite
      uv.x -= time * 0.5;

      // ✅ turbulence
      uv.y += sin(uv.x * 10.0 + time * 3.0) * 0.05;

      vec4 color = texture2D(map, uv);

      // ✅ ignorer transparent
      if (color.a < 0.05) discard;

      gl_FragColor = color;
    }
  `
});

// ✅ mesh
const sprite = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 1000),
  material
);

// ✅ animation
function animateWind() {
  requestAnimationFrame(animateWind);

  material.uniforms.time.value += 0.02;
}
animateWind();

// ✅ position
const dir = new THREE.Vector3(4600, -1300, -1100).normalize();
sprite.position.copy(dir.multiplyScalar(4800));

// ✅ scale
sprite.scale.set(0.25, 0.25, 1);

// ✅ ajout
pano1.add(sprite);
``
