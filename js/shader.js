function Shader(name) {
    this.name = name;

    this.shaders = [];
    this.program = gl.createProgram();
    this.linked = false;

    this.locations = {};

    this.camera = null;
    this.modelMatrix = mat4.create();

    if (arguments.length > 1) {
        var linkAfterLoading = (function(shader, numShaders) {
            return function(type) {
                if (shader.shaders.length == numShaders) {
                    shader.link();
                }
            }
        })(this, (arguments.length - 1) / 2);

        for (var i = 1; i < arguments.length; i += 2) {
            this.loadShader(arguments[i], arguments[i + 1], linkAfterLoading);
        }
    }
};

Shader.LOG_MISSING_ATTRIBUTES = false;
Shader.LOG_MISSING_UNIFORMS = false;

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

Shader.boundProgram = null;

Shader.prototype.bind = function() {
    if (Shader.boundProgram != this.program) {
        gl.useProgram(this.program);

        Shader.boundProgram = this.program;
    }
};

Shader.prototype.release = function() {
    if (Shader.boundProgram == this.program) {
        gl.useProgram(null);

        Shader.boundProgram = null;
    }
};

Shader.prototype.setUniform = function(name, value, func) {
    if (!(name in this.locations)) {
        this.locations[name] = gl.getUniformLocation(this.program, name);
    }

    var location = this.locations[name];

    if (location != -1) {
        func.call(gl, location, value);
        return true;
    } else {
        if (Shader.LOG_MISSING_UNIFORMS) {
            console.log("Shader.setUniform - Unable to set uniform " + name +
                        " because it isn't supported by the current shader");
        }
        return false;
    }
};

Shader.prototype.setUniformFloat = function(name, value) {
    return this.setUniform(name, value, gl.uniform1f);
};

Shader.prototype.setUniformVector2 = function(name, value) {
    return this.setUniform(name, value, gl.uniform2fv);
};

Shader.prototype.setUniformVector3 = function(name, value) {
    return this.setUniform(name, value, gl.uniform3fv);
};

Shader.prototype.setUniformVector4 = function(name, value) {
    return this.setUniform(name, value, gl.uniform4fv);
};

Shader.prototype.setUniformMatrix = function(name, mat, transpose, func) {
    transpose = transpose || false;

    if (!(name in this.locations)) {
        this.locations[name] = gl.getUniformLocation(this.program, name);
    }

    var location = this.locations[name];

    if (location != -1) {
        func.call(gl, location, transpose, mat);
        return true;
    } else {
        if (Shader.LOG_MISSING_UNIFORMS) {
            console.log("Shader.setUniform - Unable to set uniform " + name +
                        " because it isn't supported by the current shader");
        }
        return false;
    }
};

Shader.prototype.setUniformMatrix2 = function(name, mat, transpose) {
    return this.setUniformMatrix(name, mat, transpose, gl.uniformMatrix2fv);
};

Shader.prototype.setUniformMatrix3 = function(name, mat, transpose) {
    return this.setUniformMatrix(name, mat, transpose, gl.uniformMatrix3fv);
};

Shader.prototype.setUniformMatrix4 = function(name, mat, transpose) {
    return this.setUniformMatrix(name, mat, transpose, gl.uniformMatrix4fv);
};

Shader.prototype.getAttributeLocation = function(name) {
    if (!(name in this.locations)) {
        this.locations[name] = gl.getAttribLocation(this.program, name);
    }

    return this.locations[name];
};

Shader.prototype.enableVertexAttribute = function(name, buffer, size, type) {
    size = size || 3;
    type = type || gl.FLOAT;

    var location = this.getAttributeLocation(name);

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

Shader.prototype.updateMatrices = function(camera, modelMatrix) {
    var dirty = false;

    // TODO figure out a better way to do this since we're not recalculating the matrices
    // when a camera's matrices are changed or when we rebind the same model matrix that
    // has changed since the last time we've bound it

    if (camera/* && camera != this.camera*/) {
        this.camera = camera;
        dirty = true;
    }

    if (modelMatrix/* && modelMatrix != this.modelMatrix*/) {
        this.modelMatrix = modelMatrix;
        dirty = true;
    }

    if (dirty && this.camera != null) {
        var modelView = mat4.multiply(mat4.create(), this.camera.getViewMatrix(), this.modelMatrix);
        var modelViewProjection = mat4.multiply(mat4.create(), this.camera.getProjectionMatrix(), modelView);

        var normalMatrix = mat3.fromMat4(mat3.create(), modelView);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);

        this.setUniformMatrix4("modelView", modelView);
        this.setUniformMatrix4("modelViewProjection", modelViewProjection);
        this.setUniformMatrix3("normalMatrix", normalMatrix);
    }
};

Shader.prototype.setCamera = function(camera) {
    this.updateMatrices(camera, null);
};

Shader.prototype.setModelMatrix = function(modelMatrix) {
    this.updateMatrices(null, modelMatrix);
};

Shader.shaders = {};

Shader.getShader = function(name) {
    if (!(name in Shader.shaders)) {
        Shader.shaders[name] = new Shader(name, gl.VERTEX_SHADER, "shaders/" + name + ".vert",
                                          gl.FRAGMENT_SHADER, "shaders/" + name + ".frag");
    }

    return Shader.shaders[name];
};
