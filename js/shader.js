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

    var message = this.gl.getShaderInfoLog(shader);
    if (message != "") {
        console.log("Shader.addShader - Unable to compile and attach shader - " + message);
    }
};

Shader.prototype.initialize = function() {
    this.gl.linkProgram(this.program);

    var message = this.gl.getProgramInfoLog(this.program);
    if (message != "") {
        console.log("Shader.initialize - Unable to link shader program - " + message);
    }
};

Shader.prototype.cleanup = function() {
    for (var i = 0; i < this.shaders.length; i++) {
        this.gl.deleteShader(this.shaders[i]);
    }
};
