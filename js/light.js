function Light(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.diffuse = args['diffuse'] || vec4.fromValues(0.8, 0.8, 0.8, 1.0);
    this.specular = args['specular'] || vec4.fromValues(0.4, 0.4, 0.4, 1.0);

    this.falloff = args['falloff'] || vec3.fromValues(1.0, 0.0, 0.0);
};

Light.prototype.update = function() { };

Light.prototype.apply = function(shader, ambient) {
    if (shader && shader.linked) {
        var position = this.entity.transform.getWorldPosition();
        vec3.transformMat4(position, position, level.mainCamera.getViewMatrix());
        shader.setUniformVector3("lightPosition", position);

        shader.setUniformVector4("lightDiffuse", this.diffuse);
        shader.setUniformVector4("lightAmbient", ambient || vec4.create());
        shader.setUniformVector4("lightSpecular", this.specular);

        shader.setUniformVector3("lightFalloff", this.falloff);
    }
};

Light.applyNoLight = function(shader, ambient) {
    if (shader && shader.linked) {
        shader.setUniformVector4("lightDiffuse", vec4.fromValues(0.0, 0.0, 0.0, 1.0));
        shader.setUniformVector4("lightAmbient", ambient || vec4.create());
        shader.setUniformVector4("lightSpecular", vec4.fromValues(0.0, 0.0, 0.0, 1.0));

        shader.setUniformVector3("lightFalloff", vec3.create());
    }
};
