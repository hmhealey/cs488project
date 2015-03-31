function Renderer(args) {
    args = args || {};

    Component.call(this, args);
};

Renderer.prototype = Object.create(Component.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.draw = function(light) { };

Renderer.prototype.update = function() { };

function MeshRenderer(args) {
    args = args || {};

    Renderer.call(this, args);

    this.visible = 'visible' in args ? args['visible'] : true;
    this.castsShadows = args['castsShadows'] || false;
};

MeshRenderer.prototype = Object.create(Renderer.prototype);
MeshRenderer.prototype.constructor = MeshRenderer;

MeshRenderer.prototype.draw = function(light, ambient) {
    var shader = this.entity.material.apply();

    if (shader) {
        // TODO come up with a better way to set/store the camera
        shader.setModelMatrix(this.entity.transform.getLocalToWorldMatrix());
        shader.setCamera(level.mainCamera);
        shader.updateMatrices();

        if (light) {
            light.apply(shader, ambient);
        } else {
            Light.applyNoLight(shader, ambient);
        }

        this.entity.mesh.draw(shader);

        shader.release();
    }
};
