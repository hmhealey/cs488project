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

    if (this.root != null) {
        this.root.cleanup();
    }

    // we're probably still leaking meshes here
};

Level.prototype.draw = function() {
    if (this.root) {
        var lights = this.root.getComponentsInChildren(Light);

        this.root.forEachComponent(Renderer, function(renderer) {
            renderer.draw(lights[0]);
        });
    }
};

Level.prototype.update = function(time) {
    if (this.root) {
        this.root.update(time);
    }
};

Level.prototype.raycast = function(point, direction, hit, filter) {
    if (this.root) {
        var colliders = this.root.getComponentsInChildren(Collider);

        var childHit = new RaycastHit();
        var intersected = false;

        for (var i = 0; i < colliders.length; i++) {
            if (colliders[i].raycast(point, direction, childHit, filter)) {
                if (!intersected || vec3.distance(point, childHit.point) < vec3.distance(point, hit.point)) {
                    hit.setTo(childHit);
                    intersected = true;
                }
            }
        }

        return intersected;
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
