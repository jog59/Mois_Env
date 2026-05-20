const texture = new THREE.TextureLoader().load("assets/fuite_air.gif");

const material = new THREE.SpriteMaterial({
  map: texture,
  transparent: true
});

const sprite = new THREE.Sprite(material);


sprite.scale.set(2500, 2500, 1);
sprite.position.set(0, 0, -2000);


pano1.add(sprite);
console.log("Animation fuite_air chargée!");
