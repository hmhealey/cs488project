function Mesh() {
    this.vertexBuffer = null;
    this.normalBuffer = null;
    this.texCoordBuffer = null;
    this.numVertices = 0;
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

    if (this.texCoordBuffer) {
        gl.deleteBuffer(this.texCoordBuffer);
        this.texCoordBuffer = null;
    }
};

Mesh.prototype.draw = function(shader) {
    gl.useProgram(shader.program);

    var positionLocation = gl.getAttribLocation(shader.program, "position");
    if (this.vertexBuffer) {
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    }

    var normalLocation = gl.getAttribLocation(shader.program, "normal");
    if (this.normalBuffer) {
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    }

    var texCoordLocation = gl.getAttribLocation(shader.program, "texCoord");
    if (this.texCoordBuffer) {
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(texCoordLocation);
    gl.disableVertexAttribArray(normalLocation);
    gl.disableVertexAttribArray(positionLocation);

    gl.useProgram(null);
};

Mesh.prototype.setVertices = function(vertices) {
    if (!this.vertexBuffer) {
        this.vertexBuffer = gl.createBuffer();
    }

    this.numVertices = vertices.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setNormals = function(normals) {
    if (!this.normalBuffer) {
        this.normalBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
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

    /*mesh.setIndices([
        0, 2, 1,
        1, 2, 3
    ]);*/

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

    for (var i = 0; i < verticalResolution + 1; i++) {
        for (var j = 0; j < horizontalResolution; j++) {
            var x = cos(2 * M_PI * j / horizontalResolution) * sin(M_PI * i / verticalResolution);
            var y = sin(-M_PI / 2 + M_PI * i / verticalResolution);
            var z = sin(2 * M_PI * j / horizontalResolution) * sin(M_PI * i / verticalResolution);

            var vertex = (i * horizontalResolution + j) * 3;
            vertices[vertex] = radius * x;
            vertices[vertex + 1] = radius * y;
            vertices[vertex + 2] = radius * z;

            normals[vertex] = x;
            normals[vertex + 1] = y;
            normals[vertex + 2] = z;
        }
    }

    var numIndices = horizontalResolution * verticalResolution * 2;
    var indices = new Array(numIndices);
    for (var i = 0; i < numIndices / 2; i++) {
        indices[2 * i] = i;
        indices[2 * i + 1] = i + horizontalResolution;
    }

    var mesh = new Mesh();
    //var mesh = new Mesh(gl.TRIANGLE_STRIP);

    mesh.setVertices(vertices);
    mesh.setNormals(normals);
    //mesh.setIndices(indices);

    return mesh;
};
