var root = new Entity({name: "root"});

var phong = Shader.getShader("phong");
var flat = Shader.getShader("flat");

var grass = new Material({
    texture: Texture.fromColour(vec4.fromValues(0, 0x9f / 255, 0x50 / 255, 1)),
    shader: flat
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

var box1 = new Entity({
    name: "box1",
    mesh: Mesh.makeBox(4, 2, 2),
    material: red,
    position: vec3.fromValues(-5, 1, -8),
    components: [
        new BoxCollider({width: 4, height: 2, depth: 2})
    ],
    parent: root.transform
});

var box2 = new Entity({
    name: "box2",
    mesh: Mesh.makeBox(2, 3, 4),
    material: red,
    position: vec3.fromValues(-8, 1.5, -5),
    components: [
        new BoxCollider({width: 2, height: 3, depth: 4})
    ],
    parent: root.transform
});
    
var box3 = new Entity({
    name: "box3",
    mesh: Mesh.makeBox(5, 3, 2),
    material: red,
    position: vec3.fromValues(4.5, 1.5, -7),
    components: [
        new BoxCollider({width: 5, height: 3, depth: 2})
    ],
    parent: root.transform
});

var box4 = new Entity({
    name: "box4",
    mesh: Mesh.makeBox(1, 1.5, 3),
    material: blue,
    position: vec3.fromValues(2, -0.75, 2.5),
    components: [
        new BoxCollider({width: 1, height: 1.5, depth: 3})
    ],
    parent: box3.transform
});

var mover = new Entity({
    name: "mover",
    //mesh: Mesh.makeUvSphere(0.5),
    //mesh: Mesh.makeCylinder(0.5, 1),
    mesh: Mesh.makeCube(1),
    material: new Material({
        texture: Texture.fromColour(vec4.fromValues(1.0, 1.0, 1.0, 1.0)),
        shader: Shader.getShader("diffuse")
    }),
    position: vec3.fromValues(0, 0.5, 0),
    components: [
        new RigidBody(),
        //new SphereCollider({radius: 0.5}),
        //new CylinderCollider({radius: 0.5, height: 1})
        new BoxCollider({width: 1, height: 1, depth: 1})
    ],
    controller: {
        speed: 1,
        update: function(entity) {
            var rigidBody = entity.getComponent(RigidBody);

            if (rigidBody != null) {
                var dx = 0;
                var dz = 0;

                if (Input.getKey(73) && !Input.getKey(75)) {
                    dz = -this.speed;
                } else if (Input.getKey(75) && !Input.getKey(73)) {
                    dz = this.speed
                }

                if (Input.getKey(74) && !Input.getKey(76)) {
                    dx = -this.speed;
                } else if (Input.getKey(76) && !Input.getKey(74)) {
                    dx = this.speed;
                }

                vec3.set(rigidBody.velocity, dx, 0, dz);
            }
        }
    },
    parent: root.transform
});

camera = new Camera({
    name: "camera",
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(-1.5, 13, 9),
    rotation: vec3.fromValues(-45, 0, 0),
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

return new Level({root: root, mainCamera: camera, textures: textures});
