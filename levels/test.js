var root = new Entity({name: "root"});

var phong = Shader.getShader("phong");
var flat = Shader.getShader("flat");

var grass = new Material({
    shininess: 0,
    texture: Texture.fromColour(vec4.fromValues(0, 0x9f / 255, 0x50 / 255, 1)),
    shader: phong
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
    ambient: vec4.fromValues(1, 1, 0, 1),
    shininess: 0,
    texture: Texture.fromColour(vec4.fromValues(1, 1, 0, 1)),
    shader: flat
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
    mesh: Mesh.makeRectangle(20, 40),
    material: grass,
    position: vec3.fromValues(0, 0, 0),
    rotation: vec3.fromValues(-90, 0, 0),
    parent: root.transform
});

var cube1 = new Entity({
    name: "cube1",
    mesh: Mesh.makeCube(4),
    material: red,
    position: vec3.fromValues(-4, 2, -6),
    parent: root.transform
});

var cube2 = new Entity({
    name: "cube2",
    mesh: Mesh.makeCube(2),
    material: blue,
    position: vec3.fromValues(3, 1, -8),
    parent: root.transform
});

var cube2a = new Entity({
    name: "cube2a",
    mesh: cube2.mesh,
    material: blue,
    position: vec3.fromValues(0, 1.5, 0),
    scale: 0.5,
    parent: cube2.transform
});

var cube2b = new Entity({
    name: "cube2b",
    mesh: cube2.mesh,
    material: blue,
    position: vec3.fromValues(0, 1.5, 0),
    scale: 0.5,
    parent: cube2a.transform
});

var sun = new Entity({
    name: "sun",
    mesh: Mesh.makeUvSphere(2, 20, 20),
    material: yellow,
    position: vec3.fromValues(10, 10, -10),
    parent: root.transform
});

var album = new Entity({
    name: "album",
    mesh: Mesh.makeCube(2),
    material: ayreon,
    position: vec3.fromValues(5, 1.4, -4),
    rotation: vec3.fromValues(45, -45, 0),
    parent: root.transform
});

// TODO add var definition so that this isn't global
var cube3 = new Entity({
    name: "cube3",
    mesh: Mesh.makeCube(0.5),
    material: blue,
    position: vec3.fromValues(0, 2, 0),
    parent: root.transform
});

emitter = new ParticleEmitter({
    name: "emitter",
    spawnOrientation: vec3.fromValues(0, 1, 0),
    spawnOrientationRandomness: 45,
    minSpawnSpeed: 0.04,
    maxSpawnSpeed: 0.12,
    gravity: vec3.fromValues(0, -0.002, 0),
    maxAge: 800,
    /*pointSize: 20,
    colour: vec4.fromValues(0.5, 0.0, 1, 1.0),*/
    mesh: Mesh.makeCube(0.2),
    material: new Material({
        shininess: 10000,
        texture: Texture.fromColour(vec4.fromValues(0.5, 0, 1, 1))
    }),
    parent: cube3.transform
});

var n1 = new Entity({
    name: "n1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("AlternatingBrick-ColorMap.png"),
        normalMap: Texture.fromImagePath("AlternatingBrick-NormalMap.png"),
        shader: Shader.getShader("normalMapped")
    }),
    position: vec3.fromValues(-10, 2, 4),
    parent: root.transform
});

var n2 = new Entity({
    name: "n2",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("AlternatingBrick-ColorMap.png"),
        shader: phong
    }),
    position: vec3.fromValues(-10, 2, 8),
    parent: root.transform
});

var n3 = new Entity({
    name: "n3",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("AlternatingBrick-NormalMap.png"),
        shader: phong
    }),
    position: vec3.fromValues(-10, 2, 12),
    parent: root.transform
});

var b1 = new Entity({
    name: "b1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromColour(vec4.fromValues(1.0, 0.0, 0.0, 1.0)),
        texture2: Texture.fromColour(vec4.fromValues(0.0, 1.0, 0.0, 1.0)),
        texture3: Texture.fromColour(vec4.fromValues(0.0, 0.0, 1.0, 1.0)),
        texture4: Texture.fromColour(vec4.fromValues(1.0, 1.0, 1.0, 1.0)),
        shader: Shader.getShader("blend")
    }),
    position: vec3.fromValues(10, 2, 4),
    parent: root.transform
});

b1.mesh.setTexWeights([
    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0
]);

var bm1 = new Entity({
    name: "bm1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromColour(vec4.fromValues(1.0, 0.0, 0.0, 1.0)),
        texture2: Texture.fromColour(vec4.fromValues(0.0, 1.0, 0.0, 1.0)),
        texture3: Texture.fromColour(vec4.fromValues(0.0, 0.0, 1.0, 1.0)),
        blendMap: Texture.fromImagePath("blendMap.png"),
        shader: Shader.getShader("blendMap")
    }),
    position: vec3.fromValues(10, 2, 12),
    parent: root.transform
});

var bm2 = new Entity({
    name: "bm2",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("blendMap.png"),
        shader: phong
    }),
    position: vec3.fromValues(10, 2, 18),
    parent: root.transform
});

var camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(0, 2, 10),
    rotation: vec3.fromValues(0, 0, 0),
    parent: root.transform
});
camera.controller = new PlayerController({speed: 0.1, rotationSpeed: 5});

return new Level({root: root, mainCamera: camera, textures: textures});
