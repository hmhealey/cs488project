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

        // shader to draw shadow volumes with
        var shader = Shader.getShader("shadowVolumes");

        if (!shader.linked) {
            // yeah I normally don't like returns in the middle of a function, but this mass below me deserves it
            return;
        }

        shader.bind();
        shader.setCamera(this.mainCamera);
        shader.updateMatrices();

        // temporary buffers to draw shadow volume quads with
        var quad = gl.createBuffer();

        // 4
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.stencilMask(0);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        // draw the entire unlit scene
        for (var i = 0; i < numRenderers; i++) {
            if (renderers[i].visible) {
                renderers[i].draw(null, this.ambient);
            }
        }

        // 5
        gl.depthMask(0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        // 6
        // for each light
        for (var i = 0; i < numLights; i++) {
            var light = lights[i];
            var lightPosition = light.entity.transform.getWorldPosition();

            shader.bind();
            gl.bindBuffer(gl.ARRAY_BUFFER, quad);
            shader.enableVertexAttribute("position", quad, 4);

            // A
            gl.clear(gl.STENCIL_BUFFER_BIT);

            // B
            gl.colorMask(0, 0, 0, 0);
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFunc(gl.ALWAYS, 0, ~0);
            gl.stencilMask(~0);

            // C
            // for each occluder
            for (var j = 0; j < numRenderers; j++) {
                if (renderers[j].castsShadows && renderers[j].entity.mesh) {
                    var occluder = renderers[j];
                    var mesh = occluder.entity.mesh;

                    if (mesh.type != gl.TRIANGLES) {
                        console.log("I don't think we can handle non-triangular meshes for dynamic shadows");
                    }

                    // convert the position of the light to the renderer's local coordinate system so that we don't need
                    // to transform all the points in the mesh
                    var lightPositionLocal = vec3.copy(vec3.create(), lightPosition);
                    vec3.transformMat4(lightPositionLocal, lightPositionLocal, occluder.entity.transform.getWorldToLocalMatrix());

                    var triangles = mesh.getTriangles();
                    var numTriangles = triangles.length;
                    var facings = {};

                    shader.setModelMatrix(occluder.entity.transform.getLocalToWorldMatrix());
                    shader.updateMatrices();

                    // a
                    // determine if each triangle faces toward or from the light
                    for (var k = 0; k < numTriangles; k++) {
                        var triangle = triangles[k];

                        var normal = triangle.getNormal();
                        var surfaceToLight = vec3.subtract(vec3.create(), lightPositionLocal, triangle.getCenter());
                        facings[triangle] = vec3.dot(surfaceToLight, normal) > 0;
                    }

                    // b
                    gl.cullFace(gl.FRONT);
                    gl.stencilOp(gl.KEEP, gl.INCR, gl.KEEP);

                    // draws the shadow volumes
                    // this is stored in a function since f is repeating this step (with some different parameters set)
                    function cd() {
                        // c
                        // look for silhouette edges (those between a frontfacing and backfacing face) since those will make up
                        // the outside of the shadow volume when projected to infinity
                        for (var k = 0; k < numTriangles; k++) {
                            var triangle = triangles[k];

                            if (facings[triangle]) {
                                var adjacent = triangles[k].getAdjacent();

                                for (var l = 0; l < 3; l++) {
                                    if (!facings[adjacent[l]]) {
                                        var a = triangle.indices[l];
                                        var b = triangle.indices[(l + 1) % 3];

                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                                            mesh.vertices[3 * b], mesh.vertices[3 * b + 1], mesh.vertices[3 * b + 2], 1.0,
                                            mesh.vertices[3 * a], mesh.vertices[3 * a + 1], mesh.vertices[3 * a + 2], 1.0,
                                            mesh.vertices[3 * b] - lightPositionLocal[0],
                                            mesh.vertices[3 * b + 1] - lightPositionLocal[1],
                                            mesh.vertices[3 * b + 2] - lightPositionLocal[2],
                                            0.0,
                                            mesh.vertices[3 * a] - lightPositionLocal[0],
                                            mesh.vertices[3 * a + 1] - lightPositionLocal[1],
                                            mesh.vertices[3 * a + 2] - lightPositionLocal[2],
                                            0.0
                                        ]), gl.STREAM_DRAW);

                                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                                    }
                                }
                            }
                        }

                        // d
                        // now draw the frontfacing faces of the occluder as the front of the shadow volume
                        // and project the backfacing faces to infinity to serve as the back of it
                        for (var k = 0; k < numTriangles; k++) {
                            var triangle = triangles[k];

                            var a = triangle.indices[0];
                            var b = triangle.indices[1];
                            var c = triangle.indices[2];

                            if (!facings[triangle]) {
                                // this face is backwards, so project it to infinity
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                                    mesh.vertices[3 * a] - lightPositionLocal[0],
                                    mesh.vertices[3 * a + 1] - lightPositionLocal[1],
                                    mesh.vertices[3 * a + 2] - lightPositionLocal[2],
                                    0.0,
                                    mesh.vertices[3 * b] - lightPositionLocal[0],
                                    mesh.vertices[3 * b + 1] - lightPositionLocal[1],
                                    mesh.vertices[3 * b + 2] - lightPositionLocal[2],
                                    0.0,
                                    mesh.vertices[3 * c] - lightPositionLocal[0],
                                    mesh.vertices[3 * c + 1] - lightPositionLocal[1],
                                    mesh.vertices[3 * c + 2] - lightPositionLocal[2],
                                    0.0
                                ]), gl.STREAM_DRAW);
                            } else {
                                // this face is forwards so render it as is
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                                    mesh.vertices[3 * a], mesh.vertices[3 * a + 1], mesh.vertices[3 * a + 2], 1.0,
                                    mesh.vertices[3 * b], mesh.vertices[3 * b + 1], mesh.vertices[3 * b + 2], 1.0,
                                    mesh.vertices[3 * c], mesh.vertices[3 * c + 1], mesh.vertices[3 * c + 2], 1.0
                                ]), gl.STREAM_DRAW);
                            }

                            gl.drawArrays(gl.TRIANGLES, 0, 3);
                        }
                    };

                    cd();

                    // e
                    gl.cullFace(gl.BACK);
                    gl.stencilOp(gl.KEEP, gl.DECR, gl.KEEP);

                    // f
                    cd();
                }
            }

            // D
            // enabling and applying light is done when we call Renderer.draw later on

            // E
            gl.stencilFunc(gl.EQUAL, 0, ~0);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            gl.depthFunc(gl.EQUAL);
            gl.colorMask(1, 1, 1, 1);

            // F
            // draw the scene lit by this light, but only in the areas defined by the stencil buffer
            for (var j = 0; j < numRenderers; j++) {
                if (renderers[j].visible) {
                    renderers[j].draw(lights[i], null);
                }
            }

            // G
            gl.depthFunc(gl.LESS);
        }

        // 7
        gl.disable(gl.BLEND);
        gl.disable(gl.STENCIL_TEST);
        gl.depthMask(1);

        gl.deleteBuffer(quad);
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
