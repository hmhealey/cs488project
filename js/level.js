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

        // old rendering code
        /*gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        for (var i = 0; i < numRenderers; i++) {
            renderers[i].draw(lights[0], this.ambient);
        }

        return;*/

        // shader to draw shadow volumes with
        var shader = Shader.getShader("shadowVolumes");

        if (!shader.linked) {
            // yeah I normally don't like returns in the middle of a function, but this mass below me deserves it
            return;
        }

        shader.bind();

        var camera = this.mainCamera;
        shader.setCamera(camera);
        shader.updateMatrices();

        // temporary buffers to draw shadow volume quads with
        var quad = gl.createBuffer();

        // HARRISON shader tests to make sure it's working
        //gl.enable(gl.DEPTH_TEST);
        /*gl.enable(gl.CULL_FACE);

        shader.bind();
        shader.setCamera(level.mainCamera);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        shader.enableVertexAttribute("position", quad, 4);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, 1, 0, 0,
            -1, -1, 0, 0,
            1, 1, 0, 0,
            1, -1, 0, 0
        ]), gl.STREAM_DRAW);
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0]), gl.STREAM_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        //gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);*/

        //gl.enable(gl.DEPTH_TEST);
        /*gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        for (var i = 0; i < numRenderers; i++) {
            if (renderers[i].visible) {
                renderers[i].draw(lights[0], this.ambient);
                //renderers[i].draw(null, this.ambient);
                if (renderers[i].castsShadows) {
                    renderers[i].entity.mesh.getTriangles();
                }
            }
        }

        gl.disable(gl.CULL_FACE);
        //gl.disable(gl.DEPTH_TEST);

        return;*/

        // 4
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.stencilMask(0);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        for (var i = 0; i < numRenderers; i++) {
            if (renderers[i].visible) {
                //renderers[i].draw(lights[0], this.ambient);
                renderers[i].draw(null, this.ambient);
            }
        }

        // 5
        gl.depthMask(0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        // 6
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
                    for (var k = 0; k < numTriangles; k++) {
                        var triangle = triangles[k];

                        //console.log(triangle);
                        var normal = triangle.getNormal();
                        //console.log(normal);
                        var surfaceToLight = vec3.subtract(vec3.create(), lightPositionLocal, triangle.getCenter());
                        //var surfaceToLight = vec3.subtract(vec3.create(), triangle.getCenter(), lightPositionLocal);
                        //console.log(vec3.dot(surfaceToLight, normal));
                        facings[triangle] = vec3.dot(surfaceToLight, normal) > 0;
                    }

                    //console.log(facings);

                    // b
                    gl.cullFace(gl.FRONT);
                    gl.stencilOp(gl.KEEP, gl.INCR, gl.KEEP);

                    function cd() {
                        // c
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

                                        //console.log("found sihlouette edge between " + triangle.toString() + " with facing " + facings[triangle] +
                                        //            " and " + adjacent[l].toString() + " with facing " + facings[adjacent[l]]);
                                        //console.log("found sihlouette edge at " + " " + b);
                                    }
                                }
                            }
                        }

                        // d
                        for (var k = 0; k < numTriangles; k++) {
                            var triangle = triangles[k];

                            var a = triangle.indices[0];
                            var b = triangle.indices[1];
                            var c = triangle.indices[2];

                            if (!facings[triangle]) {
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

                                gl.drawArrays(gl.TRIANGLES, 0, 3);
                            } else {
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                                    mesh.vertices[3 * a], mesh.vertices[3 * a + 1], mesh.vertices[3 * a + 2], 1.0,
                                    mesh.vertices[3 * b], mesh.vertices[3 * b + 1], mesh.vertices[3 * b + 2], 1.0,
                                    mesh.vertices[3 * c], mesh.vertices[3 * c + 1], mesh.vertices[3 * c + 2], 1.0
                                ]), gl.STREAM_DRAW);

                                gl.drawArrays(gl.TRIANGLES, 0, 3);
                            }
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
            for (var j = 0; j < numRenderers; j++) {
                if (renderers[j].visible) {
                    renderers[j].draw(lights[i], null);
                }
            }

            continue;

            gl.depthFunc(gl.LESS);
            var shader1 = Shader.getShader("flat");
            shader1.bind();
            shader1.updateMatrices(level.mainCamera, occluder.entity.transform.getLocalToWorldMatrix());

            var material = new Material({
                texture: Texture.fromColour(vec4.fromValues(1.0, 0.0, 0.0, 1.0))
            });
            material.apply(shader1);

            gl.bindBuffer(gl.ARRAY_BUFFER, quad);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1000, 1000, 0,
                -1000, -1000, 0,
                1000, 1000, 0,
                1000, -1000, 0
            ]), gl.STREAM_DRAW);
            shader1.enableVertexAttribute("position", quad);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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
