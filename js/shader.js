function Shader() {
    this.shaders = [];
    this.program = gl.createProgram();
};

Shader.prototype.cleanup = function() {
    for (var i = 0; i < this.shaders.length; i++) {
        gl.deleteShader(this.shaders[i]);
    }
};

Shader.prototype.attachShader = function(type, source) {
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

Shader.prototype.link = function() {
    gl.linkProgram(this.program);

    var message = gl.getProgramInfoLog(this.program);
    if (message != "") {
        console.log("Shader.initialize - Unable to link shader program - " + message);
    }
};

