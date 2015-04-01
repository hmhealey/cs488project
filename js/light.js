function Light(args) {
    args = args || {};

    Component.call(this, args);

    this.diffuse = args['diffuse'] || vec4.fromValues(0.8, 0.8, 0.8, 1.0);
    this.specular = args['specular'] || vec4.fromValues(0.4, 0.4, 0.4, 1.0);

    this.falloff = args['falloff'] || vec3.fromValues(1.0, 0.0, 0.0);

    this.shadowPosition = vec3.create();
    this.shadowVolumes = {};
};

Light.prototype = Object.create(Component.prototype);
Light.prototype.constructor = Light;

Light.prototype.update = function() { };

Light.prototype.apply = function(shader, ambient) {
    if (shader && shader.linked) {
        var position = this.entity.transform.getWorldPosition();
        vec3.transformMat4(position, position, level.mainCamera.getViewMatrix());
        shader.setUniformVector3("lightPosition", position);

        shader.setUniformVector4("lightDiffuse", this.diffuse);
        shader.setUniformVector4("lightAmbient", ambient || vec4.fromValues(0, 0, 0, 1));
        shader.setUniformVector4("lightSpecular", this.specular);

        shader.setUniformVector3("lightFalloff", this.falloff);
    }
};

Light.prototype.flushShadowVolumes = function() {
    this.shadowVolumes = [];
};

Light.prototype.flustShadowVolumesFor = function(renderer) {
    delete this.shadowVolumes[renderer.entity.name];
};

Light.prototype.calculateShadowVolumesFor = function(renderer) {
    var name = renderer.entity.name;
    var rendererTransform = renderer.entity.transform.getWorldToLocalMatrix();
    var mesh = renderer.entity.mesh;

    // calculate this light's position in the renderer's coordinate space since that will change if the light has moved
    // relative to the renderer or vice versa
    var lightPosition = this.entity.transform.getWorldPosition();
    vec3.transformMat4(lightPosition, lightPosition, rendererTransform);

    // if we don't have shadow volume information calculated or the renderer's position has changed, generate the shadow
    // volume information. note that we don't check if the mesh changes here, but I don't think that should matter too much
    if (!(name in this.shadowVolumes) || !vec3.equals(lightPosition, this.shadowVolumes[name].lightPosition)) {
        if (renderer.enabled && renderer.castsShadows && renderer.entity.mesh && renderer.entity.mesh.loaded) {
            var triangles = renderer.entity.mesh.getTriangles();
            var numTriangles = triangles.length;

            // calculate if each triangle is facing towards or away from this light
            var facings = {};

            for (var i = 0; i < numTriangles; i++) {
                var triangle = triangles[i];

                var normal = triangle.getNormal();
                var surfaceToLight = vec3.subtract(vec3.create(), lightPosition, triangle.getCenter());
                facings[triangle] = vec3.dot(surfaceToLight, normal) > 0;
            }

            // store pairs of indices which lie along silhouette edges (ie edges between front and back facing triangles)
            var silhouetteEdges = [];

            for (var i = 0; i < numTriangles; i++) {
                var triangle = triangles[i];

                if (facings[triangle]) {
                    var adjacent = triangles[i].getAdjacent();

                    for (var j = 0; j < 3; j++) {
                        if (!facings[adjacent[j]]) {
                            silhouetteEdges.push([triangle.indices[j], triangle.indices[(j + 1) % 3]]);
                        }
                    }
                }
            }

            // store a buffer containing the vertices of the walls of the shadow volume (in local coordinates for the renderer)
            // note that these vertices are stored with their W coordinates
            var numSilhouetteEdges = silhouetteEdges.length;
            var wallVertices = [];

            for (var i = 0; i < numSilhouetteEdges; i++) {
                var a = 3 * silhouetteEdges[i][0];
                var b = 3 * silhouetteEdges[i][1];

                wallVertices.push(
                    mesh.vertices[b], mesh.vertices[b + 1], mesh.vertices[b + 2], 1.0,
                    mesh.vertices[a], mesh.vertices[a + 1], mesh.vertices[a + 2], 1.0,
                    mesh.vertices[b] - lightPosition[0], mesh.vertices[b + 1] - lightPosition[1], mesh.vertices[b + 2] - lightPosition[2], 0.0,
                    mesh.vertices[b] - lightPosition[0], mesh.vertices[b + 1] - lightPosition[1], mesh.vertices[b + 2] - lightPosition[2], 0.0,
                    mesh.vertices[a], mesh.vertices[a + 1], mesh.vertices[a + 2], 1.0,
                    mesh.vertices[a] - lightPosition[0], mesh.vertices[a + 1] - lightPosition[1], mesh.vertices[a + 2] - lightPosition[2], 0.0
                );
            }

            var wallVerticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, wallVerticesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wallVertices), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.shadowVolumes[name] = {
                lightPosition: lightPosition,
                facings: facings,
                silhouetteEdges: silhouetteEdges,
                wallVertices: wallVerticesBuffer,
                numWallVertices: wallVertices.length / 4
            };
        } else {
            this.shadowVolumes[name] = {
                lightPosition: lightPosition,
                facings: [],
                silhouetteEdges: [],
                wallVertices: null,
                numWallVertices: 0
            };
        }
    }
};

Light.prototype.getFacingsFor = function(renderer) {
    this.calculateShadowVolumesFor(renderer);

    return this.shadowVolumes[renderer.entity.name].facings;
};

Light.prototype.getSilhouetteEdgesFor = function(renderer) {
    this.calculateShadowVolumesFor(renderer);

    return this.shadowVolumes[renderer.entity.name].silhouetteEdges;
};

Light.prototype.getShadowVolumeWallVerticesFor = function(renderer) {
    this.calculateShadowVolumesFor(renderer);

    return this.shadowVolumes[renderer.entity.name].wallVertices;
};

Light.prototype.getShadowVolumeNumWallVerticesFor = function(renderer) {
    this.calculateShadowVolumesFor(renderer);

    return this.shadowVolumes[renderer.entity.name].numWallVertices;
};

Light.applyNoLight = function(shader, ambient) {
    if (shader && shader.linked) {
        shader.setUniformVector4("lightDiffuse", vec4.fromValues(0.0, 0.0, 0.0, 1.0));
        shader.setUniformVector4("lightAmbient", ambient || vec4.fromValues(0.0, 0.0, 0.0, 1.0));
        shader.setUniformVector4("lightSpecular", vec4.fromValues(0.0, 0.0, 0.0, 1.0));

        shader.setUniformVector3("lightFalloff", vec3.create());
    }
};
