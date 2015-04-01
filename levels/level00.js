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

// level geometry

ground = new Entity({
    name: "ground",
    mesh: Mesh.makeBox(50, 1, 60),
    material: grass,
    position: vec3.fromValues(0, -0.5, 0),
    components: [
        new MeshRenderer(),
        new BoxCollider({width: 50, height: 1, depth: 80})
    ],
    parent: root.transform
});

var stairs1 = new Entity({
    name: "stairs1",
    mesh: Mesh.makeBox(4, 1, 2),
    material: blue,
    position: vec3.fromValues(-11, 0.5, -11),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 4, height: 2, depth: 2}),
    ],
    parent: root.transform
});

var stairs2 = new Entity({
    name: "stairs2",
    mesh: Mesh.makeBox(4, 1, 2),
    material: blue,
    position: vec3.fromValues(0, 1, -2),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 4, height: 2, depth: 2}),
    ],
    parent: stairs1.transform
});

var stairs3 = new Entity({
    name: "stairs3",
    mesh: Mesh.makeBox(4, 1, 2),
    material: blue,
    position: vec3.fromValues(0, 1, -2),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 4, height: 2, depth: 2}),
    ],
    parent: stairs2.transform
});

var stairs4 = new Entity({
    name: "stairs4",
    mesh: Mesh.makeBox(4, 1, 2),
    material: blue,
    position: vec3.fromValues(0, 1, -2),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 4, height: 2, depth: 2}),
    ],
    parent: stairs3.transform
});

var stairsPlatform = new Entity({
    name: "stairsPlatform",
    mesh: Mesh.makeBox(22, 1, 4),
    material: red,
    position: vec3.fromValues(9, 1, -3),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 22, height: 1, depth: 4})
    ],
    parent: stairs4.transform
});

var stairsPillar1 = new Entity({
    name: "stairsPillar1",
    mesh: Mesh.makeBox(1, 4, 1),
    material: blue,
    position: vec3.fromValues(-8, -2.5, 0),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 1, height: 4, depth: 1})
    ],
    parent: stairsPlatform.transform
});

var stairsPillar2 = new Entity({
    name: "stairsPillar2",
    mesh: Mesh.makeBox(1, 4, 1),
    material: blue,
    position: vec3.fromValues(8, -2.5, 0),
    components: [
        new MeshRenderer({castsShadows: true}),
        new BoxCollider({width: 1, height: 4, depth: 1})
    ],
    parent: stairsPlatform.transform
});

// lighting

light = new Entity({
    name: "light",
    position: vec3.fromValues(100, 1000, 100),
    components: [
        new Light()
    ],
    parent: root.transform
});

// player

player = new Entity({
    name: "player",
    position: vec3.fromValues(0, 1, 10),
    components: [
        new RigidBody({useGravity: true}),
        new BoxCollider({width: 0.7, height: 1, depth: 0.7})
    ],
    controller: new PlayerController({speed: 1, rotationSpeed: 5, jumpSpeed: 2}),
    parent: root.transform
});

camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: Infinity,
    position: vec3.fromValues(0, 1.1, 0),
    parent: player.transform
});

var crosshair = new Entity({
    name: "crosshair",
    mesh: Mesh.makeCircle(0.0005, 10),
    material: grass,
    position: vec3.fromValues(0, 0, -0.101),
    parent: camera.transform
});

return new Level({
    root: root,
    mainCamera: camera,
    ambient: vec4.fromValues(0.15, 0.15, 0.15, 1.0)
});
