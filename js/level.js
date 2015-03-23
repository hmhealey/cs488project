function Level(args) {
    this.root = args["root"] || null;
    this.mainCamera = args["mainCamera"] || null;

    this.textures = args['textures'] || [];
};

Level.prototype.cleanup = function() {
    if (this.textures != null) {
        for (var i = 0; i < this.textures.length; i++) {
            this.textures[i].cleanup();
        }
    }

    // we're probably still leaking meshes here
};

Level.prototype.draw = function(shader) {
    shader.bind();

    // update camera matrices
    if (this.mainCamera) {
        shader.setCamera(this.mainCamera);
    }

    // draw the scene
    if (this.root) {
        this.root.draw(shader, mat4.create());
    }

    shader.release();
};

Level.prototype.update = function(time) {
    if (this.root) {
        this.root.update(time);
    }
};

function loadLevel(path, root) {
    var doLoadLevel = (function(_root) {
        return function(levelScript) {
            var oldLevel = level;
            level = new Function("root", levelScript).call()

            // update the camera to fit the current viewport
            Camera.mainCamera = level.mainCamera;
            Camera.mainCamera.updateScreenSize();

            // cleanup resources held by old level
            if (oldLevel != null) {
                oldLevel.cleanup();
            }
        };
    })(root);

    requestFile("levels/" + path + ".js", doLoadLevel, function() {
        console.log("Unable to load level " + path);
    });
};
