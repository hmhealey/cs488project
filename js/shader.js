function Shader(gl) {
    this.shaders = [];
    this.program = gl.createProgram();
};

Shader.prototype.addShader = function(type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    gl.attachShader(this.program, shader);
    this.shaders.push(shader);

    var message = gl.getShaderInfoLog(shader);
    if (message != "") {
        console.log("Shader.addShader - Unable to compile and attach shader - " + message);
    }
};

Shader.prototype.initialize = function() {
    gl.linkProgram(this.program);

    var message = gl.getProgramInfoLog(this.program);
    if (message != "") {
        console.log("Shader.initialize - Unable to link shader program - " + message);
    }
};

Shader.prototype.cleanup = function() {
    for (var i = 0; i < this.shaders.length; i++) {
        gl.deleteShader(this.shaders[i]);
    }
};
