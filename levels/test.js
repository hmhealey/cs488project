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
    mesh: Mesh.makeRectangle(40, 60),
    material: grass,
    position: vec3.fromValues(0, 0, 20),
    rotation: vec3.fromValues(-90, 0, 0),
    parent: root.transform
});

var groundCollider = new Entity({
    name: "groundCollider",
    position: vec3.fromValues(0, -0.5, 20),
    components: [
        new BoxCollider({width: 40, height: 1, depth: 60})
    ],
    parent: root.transform
});

var cube1 = new Entity({
    name: "cube1",
    mesh: Mesh.makeCube(4),
    material: red,
    position: vec3.fromValues(-4, 2, -6),
    parent: root.transform,
    components: [
        new BoxCollider({width: 4, height: 4, depth: 4})
    ]
});

var cube2 = new Entity({
    name: "cube2",
    mesh: Mesh.makeCube(2),
    material: blue,
    position: vec3.fromValues(3, 1, -8),
    parent: root.transform,
    components: [
        new BoxCollider({width: 2, height: 2, depth: 2})
    ]
});

var cube2a = new Entity({
    name: "cube2a",
    mesh: cube2.mesh,
    material: blue,
    position: vec3.fromValues(0, 1.5, 0),
    scale: 0.5,
    parent: cube2.transform,
    components: [
        new BoxCollider({width: 2, height: 2, depth: 2})
    ]
});

var cube2b = new Entity({
    name: "cube2b",
    mesh: cube2.mesh,
    material: blue,
    position: vec3.fromValues(0, 1.5, 0),
    scale: 0.5,
    parent: cube2a.transform,
    components: [
        new BoxCollider({width: 2, height: 2, depth: 2})
    ]
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

emitter = new Entity({
    name: "emitter",
    components: [
        new ParticleEmitter({
            spawnOrientation: vec3.fromValues(0, 1, 0),
            spawnOrientationRandomness: 45,
            minSpawnSpeed: 0.04,
            maxSpawnSpeed: 0.12,
            gravity: vec3.fromValues(0, -0.002, 0),
            maxAge: 800,
            pointSize: 20,
            colour: "random"
            //colour: vec4.fromValues(0.5, 0.0, 1, 1.0),
            /*mesh: Mesh.makeCube(0.2),
            material: new Material({
                texture: Texture.fromColour(vec4.fromValues(0.5, 0, 1, 1))
            })*/
        }),
        new ParticleRenderer()
    ],
    parent: cube3.transform
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

var bump0 = new Entity({
    name: "bump0",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("brickwork-bump-map.jpg"),
        shader: phong
    }),
    position: vec3.fromValues(-6, 2, 28),
    parent: root.transform
});

var bump1 = new Entity({
    name: "bump1",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("brickwork-texture.jpg"),
        shader: phong
    }),
    position: vec3.fromValues(-2, 2, 28),
    parent: root.transform
});

var bump2 = new Entity({
    name: "bump2",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("brickwork-texture.jpg"),
        bumpMap: Texture.fromImagePath("brickwork-bump-map.jpg"),
        //texture: Texture.fromColour(vec4.fromValues(0.3, 0.7, 0.3, 1.0)),
        //bumpMap: Texture.fromImagePath("bumps.png"),
        //bumpMap: Texture.fromColour(vec4.fromValues(1.0, 1.0, 1.0, 1.0)),
        shader: Shader.getShader("bumpMap")
    }),
    position: vec3.fromValues(2, 2, 28),
    parent: root.transform
});

var bump3 = new Entity({
    name: "bump3",
    mesh: Mesh.makeCube(4),
    material: new Material({
        shininess: 20,
        texture: Texture.fromImagePath("brickwork-texture.jpg"),
        normalMap: Texture.fromImagePath("brickwork-normal-map.jpg"),
        shader: Shader.getShader("normalMap")
    }),
    position: vec3.fromValues(6, 2, 28),
    parent: root.transform
});

mover = new Entity({
    name: "mover",
    //mesh: Mesh.makeUvSphere(0.5),
    //mesh: Mesh.makeCylinder(0.5, 1),
    mesh: Mesh.makeCube(1),
    material: new Material({
        texture: Texture.fromColour(vec4.fromValues(1.0, 1.0, 1.0, 1.0)),
        shader: diffuse
    }),
    position: vec3.fromValues(0, 1, 0),
    components: [
        new RigidBody(),
        //new SphereCollider({radius: 0.5}),
        //new CylinderCollider({radius: 0.5, height: 1})
        new BoxCollider({width: 1, height: 1, depth: 1})
    ],
    /*controller: {
        update: function(entity) {
            var rigidBody = entity.getComponent(RigidBody);

            if (rigidBody != null) {
                var dx = 0;
                var dz = 0;

                if (Input.getKey(73) && !Input.getKey(75)) {
                    dz = -0.1;
                } else if (Input.getKey(75) && !Input.getKey(73)) {
                    dz = 0.1;
                }

                if (Input.getKey(74) && !Input.getKey(76)) {
                    dx = -0.1;
                } else if (Input.getKey(76) && !Input.getKey(74)) {
                    dx = 0.1;
                }

                rigidBody.velocity[0] = dx;
                rigidBody.velocity[2] = dz;

                if (Input.getKey(32)) {
                    if (rigidBody.velocity[1] == 0) {
                        rigidBody.velocity[1] = 2;
                    }
                }
            }
        }
    },*/
    parent: root.transform
});

var circle = new Entity({
    name: "circle",
    mesh: Mesh.makeCircle(2, 20),
    material: ayreon,
    position: vec3.fromValues(0, 4, -10),
    parent: root.transform
});

var cylinder = new Entity({
    name: "cylinder",
    mesh: Mesh.makeCylinder(1, 2, 40),
    material: new Material({
        shininess: 10,
        texture: Texture.fromImagePath("AlternatingBrick-ColorMap.png"),
        shader: phong
    }),
    position: vec3.fromValues(8, 3, -1),
    components: [
        new CylinderCollider({radius: 1, height: 2})
    ],
    parent: root.transform
});

camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(0, 2, 10),
    rotation: vec3.fromValues(0, 0, 0),
    components: [
        new RigidBody({useGravity: true}),
        new BoxCollider({width: 0.7, height: 2, depth: 0.7})
    ],
    parent: root.transform
});
camera.controller = new PlayerController({speed: 1, rotationSpeed: 5, jumpSpeed: 2});

var crosshair = new Entity({
    name: "crosshair",
    mesh: Mesh.makeCircle(0.0005, 10),
    material: grass,
    position: vec3.fromValues(0, 0, -0.101),
    parent: camera.transform
});

light = new Entity({
    name: "light",
    position: vec3.fromValues(0, 2, 4),
    components: [
        new Light()
    ],
    //parent: camera.transform
    parent: root.transform
});

return new Level({
    root: root,
    mainCamera: camera,
    textures: textures,
    ambient: vec4.fromValues(0.15, 0.15, 0.15, 1.0)
});
