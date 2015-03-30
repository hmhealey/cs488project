function Renderer(args) {
    args = args || {};

    this.entity = args['entity'] || null;
};

Renderer.prototype.draw = function(light) { };

Renderer.prototype.update = function() { };

function MeshRenderer(args) {
    args = args || {};

    Renderer.call(this, args);
};

MeshRenderer.prototype = Object.create(Renderer.prototype);
MeshRenderer.prototype.constructor = MeshRenderer;

MeshRenderer.prototype.draw = function(light, ambient) {
    var shader = this.entity.material.apply();

    if (shader) {
        // TODO come up with a better way to set/store the camera
        //shader.setCamera(level.mainCamera);
        //shader.setModelMatrix(transform);
        shader.updateMatrices(level.mainCamera, this.entity.transform.getLocalToWorldMatrix());

        if (light) {
            light.apply(shader, ambient);
        } else {
            Light.applyNoLight(shader, ambient);
        }

        this.entity.mesh.draw(shader);

        shader.release();
    }
};
