var textures = [];

var root = new Entity({name: "root"});

var camera = new Camera({
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(0, 2, 1),
    forward: vec3.fromValues(0, 0, -1),
    up: vec3.fromValues(0, 1, 0)
});
root.addChild(camera);

var texture = new Texture();
texture.setImageFromPath("Ayreon_-_01011001.jpg");
textures.push(texture);

var blank = new Texture();
blank.setImageFromPath("white.png");
textures.push(blank);

var grass = new Material({
    diffuse: vec4.fromValues(0.8, 1.0, 0.8, 1.0),
    shininess: 128,
    texture: blank
});

var ground = new Entity({name: "ground", mesh: Mesh.makeSquare(1), material: grass});
ground.translate([0, 0, -10]);
ground.rotate("x", -75);
ground.scale([10, 10, 1]);
root.addChild(ground);

return new Level({root: root, mainCamera: camera, textures: textures});
