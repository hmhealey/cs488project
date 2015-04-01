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
        new BoxCollider({width: 50, height: 1, depth: 60})
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
        new BoxCollider({width: 4, height: 1, depth: 2})
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
        new BoxCollider({width: 4, height: 1, depth: 2})
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
        new BoxCollider({width: 4, height: 1, depth: 2})
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
        new BoxCollider({width: 4, height: 1, depth: 2}),
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

var album = new Entity({
    name: "album",
    mesh: Mesh.makeCube(2),
    material: new Material({
        shininess: 10,
        texture: Texture.fromImagePath("Ayreon_-_01011001.jpg"),
        shader: phong
    }),
    position: vec3.fromValues(3, Math.sqrt(3), -12),
    rotation: vec3.fromValues(45, 0, 45),
    components: [
        new MeshRenderer({castsShadows: true})
    ],
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
    position: vec3.fromValues(10, 2, -4),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
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

var b2 = new Entity({
    name: "b1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("AlternatingBrick-ColorMap.png"),
        texture2: Texture.fromImagePath("AlternatingBrick-NormalMap.png"),
        texture3: Texture.fromImagePath("Ayreon_-_01011001.jpg"),
        texture4: Texture.fromColour(vec4.fromValues(0.0, 1.0, 0.0, 1.0)),
        shader: Shader.getShader("blend")
    }),
    position: vec3.fromValues(10, 2, 0),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
    parent: root.transform
});

b2.mesh.setTexWeights(b1.mesh.texWeights);

var bm1 = new Entity({
    name: "bm1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("AlternatingBrick-ColorMap.png"),
        texture2: Texture.fromImagePath("AlternatingBrick-NormalMap.png"),
        texture3: Texture.fromImagePath("Ayreon_-_01011001.jpg"),
        blendMap: Texture.fromImagePath("blendMap.png"),
        shader: Shader.getShader("blendMap")
    }),
    position: vec3.fromValues(10, 2, 8),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
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
    position: vec3.fromValues(10, 2, 12),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
    parent: root.transform
});

var n1 = new Entity({
    name: "n1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("AlternatingBrick-ColorMap.png"),
        normalMap: Texture.fromImagePath("AlternatingBrick-NormalMap.png"),
        shader: Shader.getShader("normalMap")
    }),
    position: vec3.fromValues(6, 2, 20),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
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
    position: vec3.fromValues(2, 2, 20),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
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
    position: vec3.fromValues(-2, 2, 20),
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ],
    parent: root.transform
});

var balloons = new Interactable();
balloons.interact = function() {
    level.getEntityByName("confettiCubeSpawner").getComponent(ParticleEmitter).emitFor(1000);
};

var confettiCube = new Entity({
    name: "confettiCube",
    mesh: Mesh.makeCube(1),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("Balloons21.jpg"),
        shader: phong
    }),
    position: vec3.fromValues(0, 4, 0),
    components: [
        new BoxCollider({width: 1, height: 1, depth: 1}),
        balloons
    ],
    parent: stairsPillar2.transform
});

var confettiCubeSpawner = new Entity({
    name: "confettiCubeSpawner",
    components: [
        new ParticleEmitter({
            spawnOrientationRandomness: 60,
            minSpawnSpeed: 0.4,
            maxSpawnSpeed: 1.2,
            spawnRate: 25,
            gravity: vec3.fromValues(0, 0.1, 0),
            maxAge: 1500,
            pointSize: 10,
            colour: "random"
        }),
        new ParticleRenderer()
    ],
    parent: confettiCube.transform
});

// lighting

light = new Entity({
    name: "light",
    position: vec3.fromValues(-1000, 1000, 300),
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
        new BoxCollider({width: 0.7, height: 1.8, depth: 0.7})
    ],
    controller: new PlayerController({speed: 1, rotationSpeed: 5, jumpSpeed: 2}),
    parent: root.transform
});

camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: Infinity,
    position: vec3.fromValues(0, 0.5, 0),
    parent: player.transform
});

var crosshair = new Entity({
    name: "crosshair",
    mesh: Mesh.makeCircle(0.0005, 10),
    material: new Material({
        texture: Texture.fromColour(vec4.fromValues(0.3, 0.0, 1.0, 1.0)),
        shader: flat
    }),
    position: vec3.fromValues(0, 0, -0.101),
    parent: camera.transform
});

return new Level({
    root: root,
    mainCamera: camera,
    ambient: vec4.fromValues(0.15, 0.15, 0.15, 1.0)
});
