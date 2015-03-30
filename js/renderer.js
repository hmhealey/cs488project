function Renderer(args) {
    args = args || {};

    this.entity = args['entity'] || null;
};

Renderer.prototype.draw = function() { };

Renderer.prototype.update = function() { };

function MeshRenderer(args) {
    args = args || {};

    Renderer.call(this, args);
};

MeshRenderer.prototype = Object.create(Renderer.prototype);
MeshRenderer.prototype.constructor = MeshRenderer;

MeshRenderer.prototype.draw = function() {
    var shader = this.entity.material.apply();

    if (shader) {
        // TODO come up with a better way to set/store the camera
        //shader.setCamera(level.mainCamera);
        //shader.setModelMatrix(transform);
        shader.updateMatrices(level.mainCamera, this.entity.transform.getLocalToWorldMatrix());
        this.entity.mesh.draw(shader);

        shader.release();
    }
};
