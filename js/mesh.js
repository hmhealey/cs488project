function Mesh(type) {
    this.type = type || gl.TRIANGLES;

    this.vertices = null;
    this.vertexBuffer = null;

    this.normals = null;
    this.normalBuffer = null;
    this.tangents = null;
    this.tangentBuffer = null;

    this.texCoords = null;
    this.texCoords2 = null;
    this.texCoords3 = null;
    this.texCoords4 = null;
    this.texCoordBuffer = null;
    this.texCoordBuffer2 = null;
    this.texCoordBuffer3 = null;
    this.texCoordBuffer4 = null;

    this.vertexBuffer = null;
    this.normalBuffer = null;
    this.tangentBuffer = null;
    this.texCoordBuffer = null;
    this.texCoordBuffer2 = null;
    this.texCoordBuffer3 = null;
    this.texCoordBuffer4 = null;

    this.indices = null;
    this.indexBuffer = null;

    this.triangles = null;

    this.trianglesDirty = false;
    this.dirty = false;
};

Mesh.prototype.cleanup = function() {
    if (this.vertexBuffer) {
        gl.deleteBuffer(this.vertexBuffer);
        this.vertexBuffer = null;
    }

    if (this.normalBuffer) {
        gl.deleteBuffer(this.normalBuffer);
        this.normalBuffer = null;
    }

    if (this.tangentBuffer) {
        gl.deleteBuffer(this.tangentBuffer);
        this.tangentBuffer = null;
    }

    if (this.texCoordBuffer) {
        gl.deleteBuffer(this.texCoordBuffer);
        this.texCoordBuffer = null;
    }

    if (this.texCoordBuffer2) {
        gl.deleteBuffer(this.texCoordBuffer2);
        this.texCoordBuffer2 = null;
    }

    if (this.texCoordBuffer3) {
        gl.deleteBuffer(this.texCoordBuffer3);
        this.texCoordBuffer3 = null;
    }

    if (this.texCoordBuffer4) {
        gl.deleteBuffer(this.texCoordBuffer4);
        this.texCoordBuffer4 = null;
    }
};

Mesh.prototype.draw = function(shader) {
    this.enableAttributes(shader);

    if (!this.indexBuffer) {
        gl.drawArrays(this.type, 0, this.vertices.length / 3);
    } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(this.type, this.indices.length, gl.UNSIGNED_INT, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    this.disableAttributes(shader);
};

Mesh.prototype.enableAttributes = function(shader) {
    if (this.dirty) {
        this.updateBuffers();
    }

    shader.enableVertexAttribute("position", this.vertexBuffer);
    shader.enableVertexAttribute("normal", this.normalBuffer);
    shader.enableVertexAttribute("tangent", this.tangentBuffer);

    shader.enableVertexAttribute("texCoord", this.texCoordBuffer, 2, gl.FLOAT);
    shader.enableVertexAttribute("texCoord2", this.texCoordBuffer2, 2, gl.FLOAT);
    shader.enableVertexAttribute("texCoord3", this.texCoordBuffer3, 2, gl.FLOAT);
    shader.enableVertexAttribute("texCoord4", this.texCoordBuffer4, 2, gl.FLOAT);
    shader.enableVertexAttribute("texWeights", this.texWeightBuffer, 4, gl.FLOAT);
};

Mesh.prototype.disableAttributes = function(shader) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    shader.disableVertexAttribute("texWeights");
    shader.disableVertexAttribute("texCoord4");
    shader.disableVertexAttribute("texCoord3");
    shader.disableVertexAttribute("texCoord2");
    shader.disableVertexAttribute("texCoord");

    shader.disableVertexAttribute("normal");
    shader.disableVertexAttribute("tangent");
    shader.disableVertexAttribute("position");
};

Mesh.prototype.setVertices = function(vertices) {
    this.vertices = new Float32Array(vertices);
    this.numVertices = vertices.length / 3;

    this.trianglesDirty = true;
    this.dirty = true;
};

Mesh.prototype.setNormals = function(normals) {
    this.normals = new Float32Array(normals);

    this.trianglesDirty = true;
    this.dirty = true;
};

Mesh.prototype.setTangents = function(tangents) {
    this.tangents = new Float32Array(tangents);

    this.dirty = true;
};

Mesh.prototype.setTexCoords = function(texCoords) {
    this.texCoords = new Float32Array(texCoords);

    this.dirty = true;
};

Mesh.prototype.setTexCoords2 = function(texCoords2) {
    this.texCoords2 = new Float32Array(texCoords2);

    this.dirty = true;
};

Mesh.prototype.setTexCoords3 = function(texCoords3) {
    this.texCoords3 = new Float32Array(texCoords3);

    this.dirty = true;
};

Mesh.prototype.setTexCoords4 = function(texCoords4) {
    this.texCoords4 = new Float32Array(texCoords4);

    this.dirty = true;
};

Mesh.prototype.setTexWeights = function(texWeights) {
    this.texWeights = new Float32Array(texWeights);

    this.dirty = true;
};

Mesh.prototype.setIndices = function(indices) {
    this.indices = new Uint32Array(indices);
    this.numIndices = indices.length;

    this.trianglesDirty = true;
    this.dirty = true;
};

Mesh.prototype.setDirty = function() {
    this.trianglesDirty = true;
    this.dirty = true;
};

Mesh.prototype.updateBuffers = function() {
    this.vertexBuffer = this.updateBuffer(gl.ARRAY_BUFFER, this.vertexBuffer, this.vertices, gl.STATIC_DRAW);

    this.normalBuffer = this.updateBuffer(gl.ARRAY_BUFFER, this.normalBuffer, this.normals, gl.STATIC_DRAW);
    this.tangentBuffer = this.updateBuffer(gl.ARRAY_BUFFER, this.tangentBuffer, this.tangents, gl.STATIC_DRAW);

    this.texCoordBuffer = this.updateBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer, this.texCoords, gl.STATIC_DRAW);
    this.texCoordBuffer2 = this.updateBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer2, this.texCoords2, gl.STATIC_DRAW);
    this.texCoordBuffer3 = this.updateBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer3, this.texCoords3, gl.STATIC_DRAW);
    this.texCoordBuffer4 = this.updateBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer4, this.texCoords4, gl.STATIC_DRAW);
    this.texWeightBuffer = this.updateBuffer(gl.ARRAY_BUFFER, this.texWeightBuffer, this.texWeights, gl.STATIC_DRAW);

    this.indexBuffer = this.updateBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer, this.indices, gl.STATIC_DRAW);

    this.dirty = false;
};

Mesh.prototype.updateBuffer = function(type, buffer, data, usage) {
    if (data != null) {
        if (!buffer) {
            buffer = gl.createBuffer();
        }

        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, usage);
        gl.bindBuffer(type, null);
    }

    return buffer;
};

Mesh.prototype.getTriangles = function() {
    if (this.trianglesDirty) {
        if (this.type == gl.TRIANGLES && this.indices) {
            var numTriangles = this.indices.length / 3;

            // hopefully we shouldn't be regenerating this too often
            this.triangles = new Array(numTriangles);

            for (var i = 0; i < numTriangles; i++) {
                this.triangles[i] = new Triangle(this, this.indices[i * 3], this.indices[i * 3 + 1], this.indices[i * 3 + 2]);
            }

            this.trianglesDirty = false;
        } else if (this.type == gl.TRIANGLES) {
            console.log("Mesh.getTriangles - Unable to generate triangles for a mesh that doesn't use indexed drawing.");
        } else {
            console.log("Mesh.getTriangles - Unable to generate triangles for a mesh that isn't of type gl.TRIANGLES.");
        }

        for (var i = 0; i < numTriangles; i++) {
            var triangle = this.triangles[i];
            var adjacent = triangle.getAdjacent();

            var a = triangle.indices[0];
            var b = triangle.indices[1];
            var c = triangle.indices[2];

            console.log("triangle " + i + ": " + triangle);
            console.log("center: " + vec3.str(triangle.getCenter()));
            console.log("indices: " + a + " " + b + " " + c);
            console.log("vertices: (" + this.vertices[3 * a] + ", " + this.vertices[3 * a + 1] + ", " + this.vertices[3 * a + 2] +
                        ") (" + this.vertices[3 * b] + ", " + this.vertices[3 * b + 1] + ", " + this.vertices[3 * b + 2] +
                        ") (" + this.vertices[3 * c] + ", " + this.vertices[3 * c + 1] + ", " + this.vertices[3 * c + 2] + ")");
            console.log("normal: " + vec3.str(triangle.getNormal()));
            console.log("adjacent: (" + adjacent[0] + ") (" + adjacent[1] + ") (" + adjacent[2] + ")");
        }
    }

    return this.triangles;
};

Mesh.makeSquare = function(size) {
    return Mesh.makeRectangle(size, size);
}

Mesh.makeRectangle = function(width, height) {
    var mesh = new Mesh();

    mesh.setVertices([
        -width / 2, height / 2, 0,
        width / 2, height / 2, 0,
        -width / 2, -height / 2, 0,
        width / 2, -height / 2, 0
    ]);

    mesh.setNormals([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ]);

    mesh.setTangents([
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0
    ]);

    var texCoords = [
        0, 0,
        1, 0,
        0, 1,
        1, 1
    ];
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);

    mesh.setIndices([
        0, 2, 1,
        1, 2, 3
    ]);

    return mesh;
};

Mesh.makeCube = function(size) {
    return Mesh.makeBox(size, size, size);
};

Mesh.makeBox = function(width, height, depth) {
    var mesh = new Mesh();

    mesh.setVertices([
        -width / 2, height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2,
        width / 2, height / 2, -depth / 2,
        width / 2, height / 2, depth / 2,

        width / 2, -height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2,
        width / 2, -height / 2, -depth / 2,
        -width / 2, -height / 2, -depth / 2,

        -width / 2, height / 2, -depth / 2,
        -width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2,

        width / 2, height / 2, depth / 2,
        width / 2, -height / 2, depth / 2,
        width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2,

        -width / 2, height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2,
        width / 2, height / 2, depth / 2,
        width / 2, -height / 2, depth / 2,

        width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, -depth / 2,
        -width / 2, -height / 2, -depth / 2
    ]);

    mesh.setNormals([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
    ]);

    mesh.setTangents([
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ]);

    var texCoords = [
        0, 0, 0, 1, 1, 0, 1, 1,
        1, 0, 0, 0, 1, 1, 0, 1,
        0, 0, 0, 1, 1, 0, 1, 1,
        0, 0, 0, 1, 1, 0, 1, 1,
        0, 0, 0, 1, 1, 0, 1, 1,
        0, 0, 0, 1, 1, 0, 1, 1
    ];
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);

    mesh.setIndices([
        0, 1, 2, 2, 1, 3,
        4, 5, 6, 6, 5, 7,
        8, 9, 10, 10, 9, 11,
        12, 13, 14, 14, 13, 15,
        16, 17, 18, 18, 17, 19,
        20, 21, 22, 22, 21, 23,
    ]);

    return mesh;
};

Mesh.makeWireframeBox = function(width, height, depth) {
    var mesh = new Mesh(gl.LINES);

    mesh.setVertices([
        // lines along x
        -width / 2, -height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, -depth / 2,
        width / 2, height / 2, -depth / 2,
        -width / 2, -height / 2, depth / 2,
        width / 2, -height / 2, depth / 2,
        -width / 2, height / 2, depth / 2,
        width / 2, height / 2, depth / 2,

        // lines along y
        -width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2,
        width / 2, height / 2, -depth / 2,
        -width / 2, -height / 2, depth / 2,
        -width / 2, height / 2, depth / 2,
        width / 2, -height / 2, depth / 2,
        width / 2, height / 2, depth / 2,

        // lines along z
        -width / 2, -height / 2, -depth / 2,
        -width / 2, -height / 2, depth / 2,
        width / 2, -height / 2, -depth / 2,
        width / 2, -height / 2, depth / 2,
        -width / 2, height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2,
        width / 2, height / 2, -depth / 2,
        width / 2, height / 2, depth / 2,
    ])

    return mesh;
};

Mesh.makeShadowBox = function(width, height, depth) {
    var mesh = new Mesh();

    mesh.setVertices([
        -width / 2, -height / 2, -depth / 2,
        -width / 2, -height / 2, depth / 2,
        -width / 2, height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2,
        width / 2, -height / 2, -depth / 2,
        width / 2, -height / 2, depth / 2,
        width / 2, height / 2, -depth / 2,
        width / 2, height / 2, depth / 2,
    ]);

    mesh.setIndices([
        2, 3, 6, 6, 3, 7,
        /*-width / 2, height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2,
        width / 2, height / 2, -depth / 2,
        width / 2, height / 2, depth / 2,*/

        5, 1, 4, 4, 1, 0,
        /*width / 2, -height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2,
        width / 2, -height / 2, -depth / 2,
        -width / 2, -height / 2, -depth / 2,*/

        2, 0, 3, 3, 0, 1,
        /*-width / 2, height / 2, -depth / 2,
        -width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2,*/

        7, 5, 6, 6, 5, 4,
        /*width / 2, height / 2, depth / 2,
        width / 2, -height / 2, depth / 2,
        width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2,*/

        3, 1, 7, 7, 1, 5,
        /*-width / 2, height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2,
        width / 2, height / 2, depth / 2,
        width / 2, -height / 2, depth / 2,*/

        6, 4, 2, 2, 4, 0
        /*width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, -depth / 2,
        -width / 2, -height / 2, -depth / 2*/
    ]);

    return mesh;
};

Mesh.makeUvSphere = function(radius, horizontalResolution, verticalResolution) {
    horizontalResolution = horizontalResolution || 10;
    verticalResolution = verticalResolution || 10;

    // from http://stackoverflow.com/questions/4081898/procedurally-generate-a-sphere-mesh
    // from http://stackoverflow.com/questions/7946770/calculating-a-sphere-in-opengl
    var numVertices = horizontalResolution * (verticalResolution + 1);
    var vertices = new Array(numVertices * 3);
    var normals = new Array(numVertices * 3);
    var texCoords = new Array(numVertices * 2);

    for (var i = 0; i < verticalResolution + 1; i++) {
        for (var j = 0; j < horizontalResolution; j++) {
            var x = Math.cos(2 * Math.PI * j / horizontalResolution) * Math.sin(Math.PI * i / verticalResolution);
            var y = Math.sin(-Math.PI / 2 + Math.PI * i / verticalResolution);
            var z = Math.sin(2 * Math.PI * j / horizontalResolution) * Math.sin(Math.PI * i / verticalResolution);

            var vertex = (i * horizontalResolution + j) * 3;
            vertices[vertex] = radius * x;
            vertices[vertex + 1] = radius * y;
            vertices[vertex + 2] = radius * z;

            normals[vertex] = x;
            normals[vertex + 1] = y;
            normals[vertex + 2] = z;

            var coord = (i * horizontalResolution + j) * 2;
            texCoords[coord] = 1 - j / (horizontalResolution - 1);
            texCoords[coord + 1] = 1 - i / verticalResolution;
        }
    }

    var numIndices = horizontalResolution * verticalResolution * 6;
    var indices = new Array(numIndices);
    for (var i = 0; i < numIndices; i += 6) {
        var vertex = i / 6;
        indices[i] = vertex;
        indices[i + 1] = vertex + horizontalResolution;
        indices[i + 2] = vertex + 1;
        indices[i + 3] = vertex + 1;
        indices[i + 4] = vertex + horizontalResolution;
        indices[i + 5] = (vertex + horizontalResolution + 1) % numVertices;
    }

    var mesh = new Mesh(gl.TRIANGLES);

    mesh.setVertices(vertices);
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);
    mesh.setNormals(normals);
    mesh.setIndices(indices);

    return mesh;
};

Mesh.makeCircle = function(radius, resolution) {
    resolution = resolution || 10;

    var numVertices = resolution + 1;
    var vertices = new Array(numVertices * 3);
    var normals = new Array(numVertices * 3);
    var texCoords = new Array(numVertices * 2);

    for (var i = 0; i < resolution + 1; i++) {
        var x = Math.cos(2 * Math.PI * i / resolution);
        var y = Math.sin(2 * Math.PI * i / resolution);

        var vertex = i * 3;

        vertices[vertex] = radius * x;
        vertices[vertex + 1] = radius * y;
        vertices[vertex + 2] = 0;

        normals[vertex] = 0;
        normals[vertex + 1] = 0;
        normals[vertex + 2] = 1;

        var coord = i * 2;
        texCoords[coord] = (x + 1) / 2;
        texCoords[coord + 1] = (1 - y) / 2;
    }

    var numIndices = (resolution - 2) * 3;
    var indices = new Array(numIndices);

    for (var i = 0; i < resolution - 2; i++) {
        indices[i * 3] = i + 2;
        indices[i * 3 + 1] = 0;
        indices[i * 3 + 2] = i + 1;
    }

    var mesh = new Mesh(gl.TRIANGLES);

    mesh.setVertices(vertices);
    mesh.setNormals(normals);
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);
    mesh.setIndices(indices);

    return mesh;
};

Mesh.makeCylinder = function(radius, height, resolution) {
    resolution = resolution || 10;

    var numVertices = (resolution + 1) * 4;
    var vertices = new Array(numVertices * 3);
    var normals = new Array(numVertices * 3);
    var texCoords = new Array(numVertices * 2);

    // the following math is pretty ugly so I hope it works

    // the vertices on the round surface of the cylinder
    for (var i = 0; i < numVertices / 2; i += 2) {
        var x = Math.cos(2 * Math.PI * (i / 2) / resolution);
        var z = Math.sin(2 * Math.PI * (i / 2) / resolution);

        // the vertex at the bottom of the cylinder
        var vertex = i * 3;

        vertices[vertex] = radius * x;
        vertices[vertex + 1] = -height / 2;
        vertices[vertex + 2] = radius * z;

        normals[vertex] = x;
        normals[vertex + 1] = 0;
        normals[vertex + 2] = z;

        var coord = i * 2;
        texCoords[coord] = 1 - (i / 2) / (resolution + 1);
        texCoords[coord + 1] = 1;

        // the vertex at the top of the cylinder
        vertex = (i + 1) * 3;

        vertices[vertex] = radius * x;
        vertices[vertex + 1] = height / 2;
        vertices[vertex + 2] = radius * z;

        normals[vertex] = x;
        normals[vertex + 1] = 0;
        normals[vertex + 2] = z;

        coord = (i + 1) * 2;
        texCoords[coord] = 1 - (i / 2) / (resolution + 1);
        texCoords[coord + 1] = 0;
    }

    // the vertices on the bottom and top
    for (var i = numVertices / 2; i < numVertices; i += 2) {
        var edgeVertex = (i - numVertices / 2) * 3;

        var x = vertices[edgeVertex];
        var z = vertices[edgeVertex + 2];

        var vertex = i * 3;

        vertices[vertex] = x;
        vertices[vertex + 1] = -height / 2;
        vertices[vertex + 2] = z;

        normals[vertex] = 0;
        normals[vertex + 1] = -1;
        normals[vertex + 2] = 0;

        var coord = i * 2;
        texCoords[coord] = (x + 1) / 2;
        texCoords[coord + 1] = (1 - z) / 2;

        vertex = (i + 1) * 3;

        vertices[vertex] = x;
        vertices[vertex + 1] = height / 2;
        vertices[vertex + 2] = z;

        normals[vertex] = 0;
        normals[vertex + 1] = 1;
        normals[vertex + 2] = 0;

        coord = (i + 1) * 2;
        texCoords[coord] = (x + 1) / 2;
        texCoords[coord + 1] = (z + 1) / 2;
    }

    var numIndices = resolution * 6 + resolution * 3 + resolution * 3;
    var indices = new Array(numIndices);

    // outside wall
    for (var i = 0; i < resolution; i++) {
        indices[i * 6] = i * 2;
        indices[i * 6 + 1] = i * 2 + 1;
        indices[i * 6 + 2] = i * 2 + 2;
        indices[i * 6 + 3] = i * 2 + 2;
        indices[i * 6 + 4] = i * 2 + 1;
        indices[i * 6 + 5] = i * 2 + 3;
    }

    // top and bottom
    for (var i = 0; i < resolution; i++) {
        var index = (i + resolution * 2) * 3;

        indices[index] = numVertices / 2;
        indices[index + 1] = numVertices / 2 + i * 2;
        indices[index + 2] = numVertices / 2 + (i + 1) * 2;
        
        index = (i + resolution * 3) * 3;

        indices[index] = numVertices / 2 + 1;
        indices[index + 1] = numVertices / 2 + (i + 1) * 2 + 1;
        indices[index + 2] = numVertices / 2 + i * 2 + 1;
    }

    var mesh = new Mesh(gl.TRIANGLES);

    mesh.setVertices(vertices);
    mesh.setNormals(normals);
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);
    mesh.setIndices(indices);

    return mesh;
};

function Triangle(mesh, a, b, c) {
    this.mesh = mesh;

    this.indices = [a, b, c];

    this.center = null;
    this.point = null;
    this.normal = null;

    this.adjacent = null;
};

Triangle.prototype.getCenter = function() {
    if (!this.center) {
        this.center = vec3.fromValues((this.mesh.vertices[3 * this.indices[0]] + this.mesh.vertices[3 * this.indices[1]] + this.mesh.vertices[3 * this.indices[2]]) / 3,
                                      (this.mesh.vertices[3 * this.indices[0] + 1] + this.mesh.vertices[3 * this.indices[1] + 1] + this.mesh.vertices[3 * this.indices[2] + 1]) / 3,
                                      (this.mesh.vertices[3 * this.indices[0] + 2] + this.mesh.vertices[3 * this.indices[1] + 2] + this.mesh.vertices[3 * this.indices[2] + 2]) / 3);
    }

    return this.center;
};

Triangle.prototype.getNormal = function() {
    if (!this.normal) {
        var a = 3 * this.indices[0];
        var b = 3 * this.indices[1];
        var c = 3 * this.indices[2];

        var ab = vec3.fromValues(this.mesh.vertices[a] - this.mesh.vertices[b],
                                 this.mesh.vertices[a + 1] - this.mesh.vertices[b + 1],
                                 this.mesh.vertices[a + 2] - this.mesh.vertices[b + 2]);
        var bc = vec3.fromValues(this.mesh.vertices[b] - this.mesh.vertices[c],
                                 this.mesh.vertices[b + 1] - this.mesh.vertices[c + 1],
                                 this.mesh.vertices[b + 2] - this.mesh.vertices[c + 2]);
        /*var cb = vec3.fromValues(this.mesh.vertices[c] - this.mesh.vertices[b],
                                 this.mesh.vertices[c + 1] - this.mesh.vertices[b + 1],
                                 this.mesh.vertices[c + 2] - this.mesh.vertices[b + 2]);*/

        this.normal = vec3.create();
        //vec3.cross(this.normal, ab, ac);
        vec3.cross(this.normal, ab, bc);
        vec3.normalize(this.normal, this.normal);

        if (this.normal[0] == 0 && this.normal[1] == 0 && this.normal[2] == 0) {
            console.log(this);
            console.log(a + " " + b + " " + c);
            console.log(this.mesh.vertices.subarray(a, a + 3));
            console.log(this.mesh.vertices.subarray(b, b + 3));
            console.log(this.mesh.vertices.subarray(c, c + 3));
            console.log(ab);
            console.log(cb);
        }
    }

    return this.normal;
};

Triangle.prototype.getAdjacent = function() {
    if (!this.adjacent) {
        this.adjacent = new Array(3);

        // this should already be generated since we're calling this from a triangle
        var triangles = this.mesh.getTriangles();
        var numTriangles = triangles.length;

        for (var i = 0; i < numTriangles; i++) {
            var other = triangles[i];
            if (other != this) {
                for (var j = 0; j < 3; j++) {
                    var hasA = this.indices[j] == other.indices[0] || this.indices[j] == other.indices[1] ||
                               this.indices[j] == other.indices[2];
                    var hasB = this.indices[(j + 1) % 3] == other.indices[0] ||
                               this.indices[(j + 1) % 3] == other.indices[1] ||
                               this.indices[(j + 1) % 3] == other.indices[2];

                    if (hasA && hasB) {
                        this.adjacent[j] = other;
                    }
                }
            }
        }
    }

    return this.adjacent;
};

Triangle.prototype.toString = function() {
    return this.indices[0] + " " + this.indices[1] + " " + this.indices[2];
};
