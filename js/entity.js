function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = new Transform(this, args);

    this.parent = null;
    this.children = this.transform.children;

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;

    this.controller = args['controller'] || null;
};

Entity.prototype.addChild = function(child) {
    child.transform.setParent(this.transform);
};

Entity.prototype.draw = function(shader, parentTransform) {
    var transform = this.transform.getLocalToWorldMatrix();

    if (this.mesh) {
        this.material.applyTo(shader);
        shader.setModelMatrix(transform);
        this.mesh.draw(shader);
    }

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].entity.draw(shader, transform);
    }
};

Entity.prototype.update = function() {
    if (this.controller) {
        this.controller.update(this);
    }

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].entity.update();
    }
};
