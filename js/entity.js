function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = args['transform'] || mat4.create();
    this.children = args['children'] || [];

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;
};

Entity.prototype.rotate = function(axis, angle) {
    angle = angle * Math.PI / 180;

    if (axis === "x") {
        mat4.rotateX(this.transform, this.transform, angle);
    } else if (axis === "y") {
        mat4.rotateY(this.transform, this.transform, angle);
    } else if (axis === "z") {
        mat4.rotateZ(this.transform, this.transform, angle);
    } else {
        mat4.rotate(this.transform, this.transform, angle, axis);
    }
};

Entity.prototype.scale = function(amount) {
    mat4.scale(this.transform, this.transform, amount);
};

Entity.prototype.translate = function(amount) {
    mat4.translate(this.transform, this.transform, amount);
};

Entity.prototype.addChild = function(child) {
    this.children.push(child);
};

Entity.prototype.draw = function(shader, parentTransform) {
    var transform = mat4.multiply(mat4.create(), parentTransform, this.transform);

    if (this.mesh) {
        this.material.applyTo(shader);
        shader.setModelMatrix(transform);
        this.mesh.draw(shader);
    }

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].draw(shader, transform);
    }
};
