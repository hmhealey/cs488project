function Mesh(gl) {
    if (!gl) throw Error("gl cannot be null");

    this.gl = gl;

    this.vertexBuffer = null;
    this.numVertices = 0;
};

Mesh.prototype.initialize = function() {
    if (!this.vertexBuffer) this.vertexBuffer = this.gl.createBuffer();

    return this;
};

Mesh.prototype.cleanup = function() {
    if (this.vertexBuffer) {
        this.gl.deleteBuffer(this.vertexBuffer);
        this.vertexBuffer = null;
    }
};

Mesh.prototype.draw = function(shader) {
    this.gl.useProgram(shader.program);

    this.gl.enableVertexAttribArray(0);
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, this.numVertices, gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

    this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.gl.disableVertexAttribArray(0);

    this.gl.useProgram(null);
};

Mesh.prototype.setVertices = function(vertices) {
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.numVertices = vertices.length / 3;

    this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
};
