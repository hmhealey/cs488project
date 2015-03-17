var textures = [];

var root = new Entity({name: "root"});

var camera = new Camera({
    fov: 45,
    near: 0.1,
    far: 100,
    position: vec3.fromValues(0, 0, 0),
    forward: vec3.fromValues(0, 0, -1),
    up: vec3.fromValues(0, 1, 0),
});
root.addChild(camera);

return new Level({root: root, mainCamera: camera, textures: textures});
