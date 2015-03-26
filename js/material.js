function Material(args) {
    args = args || {};

    this.ambient = args["ambient"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.diffuse = args["diffuse"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.specular = args["specular"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.shininess = args["shininess"] || 0;

    this.texture = args["texture"] || null;
    this.texture2 = args["texture2"] || null;
    this.texture3 = args["texture3"] || null;
    this.texture4 = args["texture4"] || null;
    this.normalMap = args["normalMap"] || null;

    this.shader = args["shader"] || null; //Material.getDefaultShader();
};

Material.prototype.cleanup = function() {
    // does nothing yet, but this is just here to be consistent with other classes
};

Material.prototype.apply = function(shader) {
    shader = shader || this.shader;

    if (shader && shader.linked) {
        if (shader == this.shader) {
            shader.bind();
        }

        gl.uniform4fv(gl.getUniformLocation(shader.program, "materialDiffuse"), this.diffuse);
        gl.uniform4fv(gl.getUniformLocation(shader.program, "materialAmbient"), this.ambient);
        gl.uniform4fv(gl.getUniformLocation(shader.program, "materialSpecular"), this.specular);
        gl.uniform1f(gl.getUniformLocation(shader.program, "materialShininess"), this.shininess);

        Material.bindTexture(this.texture, shader, "texture", 0);
        Material.bindTexture(this.texture2, shader, "texture2", 1);
        Material.bindTexture(this.texture3, shader, "texture3", 2);
        Material.bindTexture(this.texture4, shader, "texture4", 3);

        Material.bindTexture(this.normalMap, shader, "normalMap", 4);

        // return the shader so we can set up any other properties
        return shader;
    } else {
        return null;
    }
};

Material.bindTexture = function(texture, shader, name, unit) {
    if (texture && texture.loaded) {
        var location = shader.getUniformLocation(name);

        if (location != -1) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            texture.bind();
            gl.uniform1i(location, unit);
        }
    }
};

Material.defaultShader = null;

Material.getDefaultShader = function() {
    if (!Material.defaultShader) {
        Material.defaultShader = Shader.getShader("flat");
    }

    return Material.defaultShader;
};
