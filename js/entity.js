function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = new Transform(this, args);

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;

    this.controller = args['controller'] || null;
};

Entity.prototype.draw = function() {
    var transform = this.transform.getLocalToWorldMatrix();

    if (this.mesh) {
        var shader = this.material.apply();
        if (shader) {
            // TODO come up with a better way to set/store the camera
            //shader.setCamera(level.mainCamera);
            //shader.setModelMatrix(transform);
            shader.updateMatrices(level.mainCamera, transform);
            this.mesh.draw(shader);

            shader.release();
        }
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.draw();
    }
};

Entity.prototype.update = function(time) {
    if (this.controller) {
        this.controller.update(this);
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.update(time);
    }
};

Entity.prototype.cleanup = function() {
    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.cleanup();
    }
};
