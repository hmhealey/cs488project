function Material(args) {
    args = args || {};

    this.ambient = args["ambient"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.diffuse = args["diffuse"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.specular = args["specular"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.shininess = args["shininess"] || 0;

    this.texture = args["texture"] || null;
};

Material.prototype.cleanup = function() {
    // does nothing yet, but this is just here to be consistent with other classes
};

Material.prototype.applyTo = function(shader) {
    gl.uniform4fv(gl.getUniformLocation(shader.program, "materialDiffuse"), this.diffuse);
    gl.uniform4fv(gl.getUniformLocation(shader.program, "materialAmbient"), this.ambient);
    gl.uniform4fv(gl.getUniformLocation(shader.program, "materialSpecular"), this.specular);
    gl.uniform1f(gl.getUniformLocation(shader.program, "materialShininess"), this.shininess);

    if (this.texture && this.texture.loaded) {
        // we aren't supporting multitexturing yet so just bind to texture0
        this.texture.bind();
        gl.uniform1i(gl.getUniformLocation(shader.program, "texture"), 0);
    }
};
