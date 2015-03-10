function Mesh() {
    this.vertexBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();
    this.texCoordBuffer = gl.createBuffer();
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
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    var normalLocation = gl.getAttribLocation(shader.program, "normal");
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    var texCoordLocation = gl.getAttribLocation(shader.program, "texCoord");
    gl.enableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(texCoordLocation);
    gl.disableVertexAttribArray(normalLocation);
    gl.disableVertexAttribArray(positionLocation);

    gl.useProgram(null);
};

Mesh.prototype.setVertices = function(vertices) {
    this.numVertices = vertices.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setNormals = function(normals) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexCoords = function(texCoords) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};
