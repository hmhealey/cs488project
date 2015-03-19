var root = new Entity({name: "root"});

var grass = new Material({
    shininess: 0,
    texture: Texture.fromColour(vec4.fromValues(0, 0x9f / 255, 0x50 / 255, 1))
});
var red = new Material({
    shininess: 128,
    texture: Texture.fromColour(vec4.fromValues(1, 0, 0, 1))
});
var blue = new Material({
    shininess: 128,
    texture: Texture.fromColour(vec4.fromValues(0, 0, 1, 1))
});
var yellow = new Material({
    ambient: vec4.fromValues(1, 1, 0, 1),
    shininess: 0,
    texture: Texture.fromColour(vec4.fromValues(1, 1, 0, 1))
});
var ayreon = new Material({
    shininess: 10,
    texture: Texture.fromImagePath("Ayreon_-_01011001.jpg")
});

// TODO come up with a way to construct this automatically?
var textures = [grass.texture, red.texture, blue.texture, yellow.texture, ayreon.texture];

var ground = new Entity({
    name: "ground",
    mesh: Mesh.makeSquare(20),
    material: grass,
    position: vec3.fromValues(0, 0, 0),
    rotation: vec3.fromValues(-90, 0, 0)
});
root.addChild(ground);

var cube1 = new Entity({
    name: "cube1",
    mesh: Mesh.makeCube(4),
    material: red,
    position: vec3.fromValues(-4, 2, -6)
});
root.addChild(cube1);

var cube2 = new Entity({
    name: "cube2",
    mesh: Mesh.makeCube(2),
    material: blue,
    position: vec3.fromValues(3, 1, -8)
});
root.addChild(cube2);

var cube2a = new Entity({
    name: "cube2a",
    mesh: cube2.mesh,
    material: blue,
    position: vec3.fromValues(0, 1.5, 0),
    scale: 0.5
});
cube2.addChild(cube2a);

var cube2b = new Entity({
    name: "cube2b",
    mesh: cube2.mesh,
    material: blue,
    position: vec3.fromValues(0, 1.5, 0),
    scale: 0.5
});
cube2a.addChild(cube2b);

var sun = new Entity({
    name: "sun",
    mesh: Mesh.makeUvSphere(2, 20, 20),
    material: yellow,
    position: vec3.fromValues(10, 10, -10),
});
root.addChild(sun);

var album = new Entity({
    name: "album",
    mesh: Mesh.makeCube(2),
    material: ayreon,
    position: vec3.fromValues(5, 1.4, -4),
    rotation: vec3.fromValues(45, -45, 0)
});
root.addChild(album);

var camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(0, 2, 10),
    rotation: vec3.fromValues(0, 0, 0)
});
camera.controller = new PlayerController({speed: 0.1, rotationSpeed: 5});
root.addChild(camera);

return new Level({root: root, mainCamera: camera, textures: textures});
