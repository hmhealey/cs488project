var root = new Entity({name: "root"});

var phong = Shader.getShader("phong");
var diffuse = Shader.getShader("diffuse");
var flat = Shader.getShader("flat");

var grass = new Material({
    texture: Texture.fromColour(vec4.fromValues(0, 0x9f / 255, 0x50 / 255, 1)),
    shader: diffuse
});
var red = new Material({
    shininess: 128,
    texture: Texture.fromColour(vec4.fromValues(1, 0, 0, 1)),
    shader: phong
});
var blue = new Material({
    shininess: 128,
    texture: Texture.fromColour(vec4.fromValues(0, 0, 1, 1)),
    shader: phong
});
var yellow = new Material({
    shininess: 128,
    texture: Texture.fromColour(vec4.fromValues(1, 1, 0, 1)),
    shader: phong
});
var ayreon = new Material({
    shininess: 10,
    texture: Texture.fromImagePath("Ayreon_-_01011001.jpg"),
    shader: phong
});

// TODO come up with a way to construct this automatically?
var textures = [grass.texture, red.texture, blue.texture, yellow.texture, ayreon.texture];

var ground = new Entity({
    name: "ground",
    mesh: Mesh.makeRectangle(60, 60),
    material: grass,
    position: vec3.fromValues(0, 0, 0),
    rotation: vec3.fromValues(-90, 0, 0),
    parent: root.transform
});

shadowCube = new Entity({
    name: "shadowCube",
    //mesh: Mesh.makeCube(1),
    //mesh: Mesh.makeUvSphere(2, 8, 8),
    mesh: Mesh.makeShadowBox(1, 1, 1),
    material: red,
    position: vec3.fromValues(0, 0.5, -5),
    components: [
        new MeshRenderer({castsShadows: true})
    ],
    parent: root.transform
});

var box1 = new Entity({
    name: "box1",
    mesh: Mesh.makeCube(2),
    material: blue,
    position: vec3.fromValues(6, 1, -6),
    parent: root.transform
});

var box2 = new Entity({
    name: "box2",
    mesh: Mesh.makeUvSphere(2, 20, 20),
    material: yellow,
    position: vec3.fromValues(-8, 2, -10),
    parent: root.transform
});

var box3 = new Entity({
    name: "box3",
    mesh: Mesh.makeBox(10, 10, 1),
    material: red,
    position: vec3.fromValues(0, 5, -20),
    parent: root.transform
});

var camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: Infinity,
    position: vec3.fromValues(0, 2, 10),
    rotation: vec3.fromValues(0, 0, 0),
    parent: root.transform
});
camera.controller = new PlayerController({speed: 0.1, rotationSpeed: 5});

var crosshair = new Entity({
    name: "crosshair",
    mesh: Mesh.makeCircle(0.0005, 10),
    material: grass,
    position: vec3.fromValues(0, 0, -0.101),
    parent: camera.transform
});

var light = new Entity({
    name: "light",
    position: vec3.fromValues(0, 0.5, 0),
    components: [
        new Light()
    ],
    //parent: camera.transform
    parent: root.transform
});

return new Level({root: root, mainCamera: camera, textures: textures});
