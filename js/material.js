function Material(opts) {
    opts = opts || {};

    this.ambient = opts["ambient"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.diffuse = opts["diffuse"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.specular = opts["specular"] || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.shininess = opts["shininess"] || 0;

    this.texture = opts["texture"] || null;
};

Material.prototype.cleanup = function() {
    // does nothing yet, but this is just here to be consistent with other classes
};

Material.prototype.applyTo = function(shader) {
    gl.uniform4fv(gl.getUniformLocation(shader.program, "materialAmbient"), this.ambient);
    gl.uniform4fv(gl.getUniformLocation(shader.program, "materialDiffuse"), this.diffuse);
    gl.uniform4fv(gl.getUniformLocation(shader.program, "materialSpecular"), this.specular);
    gl.uniform1f(gl.getUniformLocation(shader.program, "materialShininess"), this.shininess);
};
