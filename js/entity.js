function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = new Transform(this, args);

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;

    this.controller = args['controller'] || null;
};

Entity.prototype.draw = function(shader) {
    var transform = this.transform.getLocalToWorldMatrix();

    if (this.mesh) {
        this.material.applyTo(shader);
        shader.setModelMatrix(transform);
        this.mesh.draw(shader);
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.draw(shader);
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
