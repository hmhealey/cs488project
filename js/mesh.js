function Mesh(gl) {
    if (!gl) throw Error("gl cannot be null");

    this.gl = gl;

    this.vertexBuffer = null;
    this.texCoordBuffer = null;
    this.numVertices = 0;
};

Mesh.prototype.initialize = function() {
    if (!this.vertexBuffer) this.vertexBuffer = this.gl.createBuffer();
    if (!this.texCoordBuffer) this.texCoordBuffer = this.gl.createBuffer();

    return this;
};

Mesh.prototype.cleanup = function() {
    if (this.vertexBuffer) {
        this.gl.deleteBuffer(this.vertexBuffer);
        this.vertexBuffer = null;
    }

    if (this.texCoordBuffer) {
        this.gl.deleteBuffer(this.texCoordBuffer);
        this.texCoordBuffer = null;
    }
};

Mesh.prototype.draw = function(shader) {
    this.gl.useProgram(shader.program);

    var positionLocation = this.gl.getAttribLocation(shader.program, "position");
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    var texCoordLocation = this.gl.getAttribLocation(shader.program, "texCoord");
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

    this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.gl.disableVertexAttribArray(texCoordLocation);
    this.gl.disableVertexAttribArray(positionLocation);

    this.gl.useProgram(null);
};

Mesh.prototype.setVertices = function(vertices) {
    this.numVertices = vertices.length / 3;

    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Mesh.prototype.setTexCoords = function(texCoords) {
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
};
