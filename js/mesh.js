function Mesh(type) {
    this.type = type || gl.TRIANGLES;

    this.vertexBuffer = null;
    this.normalBuffer = null;
    this.tangentBuffer = null;
    this.texCoordBuffer = null;
    this.texCoordBuffer2 = null;
    this.texCoordBuffer3 = null;
    this.texCoordBuffer4 = null;
    this.numVertices = 0;

    this.indexBuffer = null
    this.numIndices = 0;
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
        gl.drawArrays(this.type, 0, this.numVertices);
    } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(this.type, this.numIndices, gl.UNSIGNED_INT, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    this.disableAttributes(shader);
};

Mesh.prototype.enableAttributes = function(shader) {
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
    if (!this.vertexBuffer) {
        this.vertexBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.numVertices = vertices.length / 3;
};

Mesh.prototype.setNormals = function(normals) {
    if (!this.normalBuffer) {
        this.normalBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTangents = function(tangents) {
    if (!this.tangentBuffer) {
        this.tangentBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexCoords = function(texCoords) {
    if (!this.texCoordBuffer) {
        this.texCoordBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexCoords2 = function(texCoords2) {
    if (!this.texCoordBuffer2) {
        this.texCoordBuffer2 = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexCoords3 = function(texCoords3) {
    if (!this.texCoordBuffer3) {
        this.texCoordBuffer3 = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords3), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexCoords4 = function(texCoords4) {
    if (!this.texCoordBuffer4) {
        this.texCoordBuffer4 = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords4), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexWeights = function(texWeights) {
    if (!this.texWeightBuffer) {
        this.texWeightBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texWeightBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texWeights), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setIndices = function(indices) {
    if (!this.indexBuffer) {
        this.indexBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.numIndices = indices.length;
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
        -width / 2, height / 2, -depth / 2, -width / 2, height / 2, depth / 2,
        width / 2, height / 2, -depth / 2, width / 2, height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2, width / 2, height / 2, depth / 2,
        width / 2, -height / 2, depth / 2, -width / 2, -height / 2, depth / 2,
        width / 2, -height / 2, -depth / 2, width / 2, -height / 2, -depth / 2,
        -width / 2, -height / 2, depth / 2, -width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, -depth / 2, -width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2, -width / 2, height / 2, depth / 2,
        -width / 2, -height / 2, -depth / 2, -width / 2, -height / 2, depth / 2,
        width / 2, height / 2, depth / 2, width / 2, -height / 2, depth / 2,
        width / 2, height / 2, -depth / 2, width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, depth / 2, width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, depth / 2, -width / 2, -height / 2, depth / 2,
        width / 2, height / 2, depth / 2, width / 2, height / 2, depth / 2,
        -width / 2, -height / 2, depth / 2, width / 2, -height / 2, depth / 2,
        width / 2, height / 2, -depth / 2, width / 2, -height / 2, -depth / 2,
        -width / 2, height / 2, -depth / 2, -width / 2, height / 2, -depth / 2,
        width / 2, -height / 2, -depth / 2, -width / 2, -height / 2, -depth / 2
    ]);

    mesh.setNormals([
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1
    ]);

    mesh.setTangents([
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ]);

    var texCoords = [
        0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
        1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1,
        0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
        0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
        0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
        0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1
    ];
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);

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

    var numIndices = horizontalResolution * verticalResolution * 2;
    var indices = new Array(numIndices);
    for (var i = 0; i < numIndices / 2; i++) {
        indices[2 * i] = i;
        indices[2 * i + 1] = i + horizontalResolution;
    }

    var mesh = new Mesh(gl.TRIANGLE_STRIP);

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

    var mesh = new Mesh(gl.TRIANGLE_FAN);

    mesh.setVertices(vertices);
    mesh.setNormals(normals);
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);

    return mesh;
};

Mesh.makeCylinder = function(radius, height, resolution) {
    resolution = resolution || 10;

    var numVertices = (resolution + 1) * 2;
    var vertices = new Array(numVertices * 3);
    var normals = new Array(numVertices * 3);
    var texCoords = new Array(numVertices * 2);

    for (var i = 0; i < numVertices; i += 2) {
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

    var mesh = new Mesh(gl.TRIANGLE_STRIP);

    mesh.setVertices(vertices);
    mesh.setNormals(normals);
    mesh.setTexCoords(texCoords);
    mesh.setTexCoords2(texCoords);
    mesh.setTexCoords3(texCoords);
    mesh.setTexCoords4(texCoords);

    return mesh;
};
