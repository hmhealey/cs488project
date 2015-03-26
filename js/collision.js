function BoxCollider(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.width = args['width'] || 1;
    this.height = args['height'] || 1;
    this.depth = args['depth'] || 1;
};

BoxCollider.draw = true;
BoxCollider.drawLineWidth = 2.0;

BoxCollider.prototype.draw = function() {
    if (BoxCollider.draw) {
        var shader = Shader.getShader("wireframe");

        if (shader && shader.linked) {
            gl.disable(gl.DEPTH_TEST);

            shader.bind();
            shader.updateMatrices(level.mainCamera, this.entity.transform.getLocalToWorldMatrix());

            shader.setUniformVector4("colour", vec4.fromValues(0.5, 0.0, 1.0, 1.0));

            // this is a debug operation, so we're fine to constantly create new meshes
            var mesh = Mesh.makeWireframeBox(this.width, this.height, this.depth);

            gl.lineWidth(BoxCollider.drawLineWidth);
            mesh.draw(shader);

            mesh.cleanup();

            shader.release();

            gl.enable(gl.DEPTH_TEST);
        }
    }
};

BoxCollider.prototype.update = function(time) {
};
