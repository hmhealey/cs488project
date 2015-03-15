function Shader() {
    this.shaders = [];
    this.program = gl.createProgram();
    this.linked = false;

    this.locations = {};
};

Shader.LOG_MISSING_ATTRIBUTES = false;

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

/** Requests a shader from the given url and uses it as source code for a given shader type. If this is successful,
 *  the provided callback is called with the shader type as an argument. The callback can be undefined. **/
Shader.prototype.loadShader = function(type, url, callback) {
    var requestCallback = (function(shader) {
        return function(source) {
            shader.attachShader(type, source);

            if (callback) {
                callback(type);
            }
        };
    })(this);

    requestFile(url, requestCallback, function(url, status) {
        console.log("Shader.loadShader - Unable to load shader from " + url + " - " + status);
    });
};

Shader.prototype.link = function() {
    gl.linkProgram(this.program);

    // keep track if linking succeeded
    var error = gl.getError();
    if (error == gl.NO_ERROR) {
        this.linked = true;
    } else {
        console.log(error);
        this.linked = false;
    }

    var message = gl.getProgramInfoLog(this.program);
    if (message != "") {
        console.log("Shader.initialize - Unable to link shader program - " + message);
    }
};

Shader.prototype.bind = function() {
    gl.useProgram(this.program);
};

Shader.prototype.release = function() {
    gl.useProgram(null);
};

Shader.prototype.enableVertexAttribute = function(name, buffer, size, type) {
    size = size || 3;
    type = type || gl.FLOAT;

    if (!(name in this.locations)) {
        this.locations[name] = gl.getAttribLocation(this.program, name);
    }

    var location = this.locations[name];

    if (location != -1) {
        gl.enableVertexAttribArray(location);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(location, size, type, false, 0, 0);

        return true;
    } else {
        if (Shader.LOG_MISSING_ATTRIBUTES) {
            console.log("Shader.enableVertexAttribute - Unable to enable attribute " + name +
                        " because it isn't supported by the current shader");
        }
        return false;
    }
};

Shader.prototype.disableVertexAttribute = function(name) {
    if (!(name in this.locations)) {
        this.locations[name] = gl.getAttribLocation(this.program, name);
    }

    var location = this.locations[name];

    if (location != -1) {
        gl.disableVertexAttribArray(location);
        return true;
    } else {
        if (Shader.LOG_MISSING_ATTRIBUTES) {
            console.log("Shader.disableVertexAttribute - Unable to disable attribute " + name +
                        " because it isn't supported by the current shader");
        }
        return false;
    }
};
