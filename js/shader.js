function Shader(gl) {
    if (!gl) throw Error("gl cannot be null");

    this.gl = gl;
    this.shaders = [];
    this.program = this.gl.createProgram();
};

Shader.prototype.addShader = function(type, source) {
    var shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    this.gl.attachShader(this.program, shader);
    this.shaders.push(shader);
};

Shader.prototype.initialize = function() {
    this.gl.linkProgram(this.program);
};

Shader.prototype.cleanup = function() {
    for (var i = 0; i < this.shaders.length; i++) {
        this.gl.deleteShader(this.shaders[i]);
    }
};
