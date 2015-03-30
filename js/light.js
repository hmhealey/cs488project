function Light(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.diffuse = args['diffuse'] || vec4.fromValues(0.8, 0.8, 0.8, 1.0);
    this.specular = args['specular'] || vec4.fromValues(0.4, 0.4, 0.4, 1.0);

    //this.falloff = args['falloff'] || vec3.fromValues(1.0, 0.0, 0.0);
};

Light.prototype.update = function() { };

Light.prototype.apply = function(shader, ambient) {
    if (shader && shader.linked) {
        var position = this.entity.transform.getWorldPosition();
        vec3.transformMat4(position, position, level.mainCamera.getViewMatrix());
        gl.uniform3fv(shader.getUniformLocation("lightPosition"), position);

        gl.uniform4fv(shader.getUniformLocation("lightDiffuse"), this.diffuse);
        gl.uniform4fv(shader.getUniformLocation("lightAmbient"), ambient || vec4.create());
        gl.uniform4fv(shader.getUniformLocation("lightSpecular"), this.specular);
    }
};

Light.applyNoLight = function(shader, ambient) {
    if (shader && shader.linked) {
        gl.uniform4f(shader.getUniformLocation("lightDiffuse"), 0.0, 0.0, 0.0, 1.0);
        gl.uniform4fv(shader.getUniformLocation("lightAmbient"), ambient || vec4.create());
        gl.uniform4f(shader.getUniformLocation("lightSpecular"), 0.0, 0.0, 0.0, 1.0);
    }
};
