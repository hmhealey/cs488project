function Level(args) {
    this.root = args["root"] || null;
    this.mainCamera = args["mainCamera"] || null;

    this.ambient = args["ambient"] || vec4.fromValues(0.1, 0.1, 0.1, 1.0);

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.root) {
        var lights = this.root.getComponentsInChildren(Light);
        var numLights = lights.length;

        var renderers = this.root.getComponentsInChildren(Renderer);
        var numRenderers = renderers.length;

        // 4
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        for (var i = 0; i < numRenderers; i++) {
            renderers[i].draw(null, this.ambient);
        }

        // 5
        gl.depthMask(0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        // 6
        for (var i = 0; i < numLights; i++) {
            // A
            gl.clear(gl.STENCIL_BUFFER_BIT);

            /*// B
            gl.colorMask(0, 0, 0, 0);
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFunc(gl.ALWAYS, 0, ~0);
            gl.stencilMask(~0)

            // TODO C

            // D
            // enabling and applying light is done when we call Renderer.draw later on

            // E
            gl.stencilFunc(gl.EQUAL, 0, ~0);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);*/
            gl.depthFunc(gl.EQUAL);
            gl.colorMask(1, 1, 1, 1);

            // F
            for (var j = 0; j < numRenderers; j++) {
                renderers[j].draw(lights[i], null);
            }

            // G
            gl.depthFunc(gl.LESS);
        }

        // 7
        gl.disable(gl.BLEND);
        gl.disable(gl.STENCIL_TEST);
        gl.depthMask(1);
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
