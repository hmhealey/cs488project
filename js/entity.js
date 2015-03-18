function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = args['transform'] || mat4.create();

    if ('position' in args) {
        mat4.translate(this.transform, this.transform, args['position']);
    }

    if ('rotation' in args) {
        mat4.rotateZ(this.transform, this.transform, args['rotation'][2] * Math.PI / 180);
        mat4.rotateY(this.transform, this.transform, args['rotation'][1] * Math.PI / 180);
        mat4.rotateX(this.transform, this.transform, args['rotation'][0] * Math.PI / 180);
    }

    if ('scale' in args) {
        mat4.scale(this.transform, this.transform, toVec3(args['scale']));
    }

    this.parent = null;
    this.children = args['children'] || [];

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;
};

Entity.prototype.getPosition = function() {
    // we could probably just pull the translate values from the transform matrix
    var position = vec3.fromValues(0, 0, 0);
    vec3.transformMat4(position, position, this.transform);
    return position;
};

Entity.prototype.translate = function(amount) {
    mat4.translate(this.transform, this.transform, amount);
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

Entity.prototype.getTransform = function() {
    return transform;
};

Entity.prototype.setTransform = function(transform) {
    this.transform = transform;
};

Entity.prototype.addChild = function(child) {
    if (child.parent == null) {
        this.children.push(child);
        child.parent = this;
    } else {
        console.log("Unable to make " + child.name + " a child of " + this.name + " because it already has parent " + child.parent.name);
    }
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
