function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = new Transform(this, args);

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;

    this.controller = args['controller'] || null;
};

Entity.prototype.draw = function(shader) {
    if (this.mesh) {
        this.material.applyTo(shader);
        shader.setModelMatrix(this.transform.getLocalToWorldMatrix());
        this.mesh.draw(shader);
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.draw(shader);
    }
};

Entity.prototype.update = function() {
    if (this.controller) {
        this.controller.update(this);
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.update();
    }
};

Entity.prototype.cleanup = function() {
    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.cleanup();
    }
};
