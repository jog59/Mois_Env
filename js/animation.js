const texture = new THREE.TextureLoader().load("assets/fuite_air.gif");

const material = new THREE.SpriteMaterial({
  map: texture,
  transparent: true
});

const sprite = new THREE.Sprite(material);

sprite.scale.set(500, 500, 1);
sprite.position.set(2000, 500, 2000);

pano1.add(sprite);
