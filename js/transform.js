function Transform(entity, args) {
    args = args || {};

    this.entity = entity;

    this.parent = args["parent"] || null;
    this.children = args["children"] || [];

    // local transformations
    this.position = args["position"] || vec3.create();

    this.rotation = quat.create();
    if ("rotation" in args) {
        this.setRotation(args["rotation"]);
    }

    this.scale = "scale" in args ? toVec3(args["scale"]) : vec3.fromValues(1, 1, 1);

    // parent to local transformation matrix
    this.matrix = mat4.create();
    this.dirty = true;

    // matrices that transform from world to local coordinates and vice versa
    this.localToWorld = mat4.create();
    this.localToWorldDirty = true;

    this.worldToLocal = mat4.create();
    this.worldToLocalDirty = true;
};

Transform.prototype.setParent = function(parent) {
    if (this.parent) {
        // remove us as a child of our existing parent
        this.parent.children.splice(array.indexOf(this), 1);
    }

    this.parent = parent;

    if (parent)  {
        // add us as a child of our existing parent
        this.parent.children.push(this);
    }

    this.setParentDirty();
};

Transform.prototype.setDirty = function() {
    this.dirty = true;

    this.setParentDirty();
};

Transform.prototype.setParentDirty = function() {
    this.localToWorldDirty = true;
    this.worldToLocalDirty = true;

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].setParentDirty();
    }
};

Transform.prototype.getMatrix = function() {
    if (this.dirty) {
        mat4.fromRotationTranslation(this.matrix, this.rotation, this.position);
        mat4.scale(this.matrix, this.matrix, this.scale);

        this.dirty = false;
    }

    return this.matrix;
};

Transform.prototype.getLocalToWorldMatrix = function() {
    if (this.localToWorldDirty) {
        if (this.parent) {
            mat4.multiply(this.localToWorld, this.parent.getLocalToWorldMatrix(), this.getMatrix());
        } else {
            mat4.copy(this.localToWorld, this.matrix);
        }

        this.localToWorldDirty = false;
    }

    return this.localToWorld;
};

Transform.prototype.getWorldToLocalMatrix = function() {
    if (this.worldToLocalDirty) {
        mat4.invert(this.worldToLocal, this.getLocalToWorldMatrix());

        this.worldToLocalDirty = false;
    }

    return this.worldToLocal;
};

Transform.prototype.getPosition = function() {
    return this.position;
};

Transform.prototype.setPosition = function(position) {
    this.position = position;
    this.setDirty();
};

Transform.prototype.translate = function(amount) {
    vec3.add(this.position, this.position, amount);
    this.setDirty();

    return this.position;
};

Transform.prototype.getRotation = function() {
    return this.rotation;
};

Transform.prototype.setRotation = function(rotation) {
    if (rotation.length == 4) {
        this.rotation = rotation;
    } else if (rotation.length == 3) {
        // rotation is a vector of euler angles
        quat.identity(this.rotation);
        quat.rotateZ(this.rotation, this.rotation, rotation[2] * Math.PI / 180);
        quat.rotateY(this.rotation, this.rotation, rotation[1] * Math.PI / 180);
        quat.rotateX(this.rotation, this.rotation, rotation[0] * Math.PI / 180);
    }

    this.setDirty();
};

Transform.prototype.rotate = function(axis, angle) {
    angle = angle * Math.PI / 180;

    if (axis == "x") {
        quat.rotateX(this.rotation, this.rotation, angle);
    } else if (axis == "y") {
        quat.rotateY(this.rotation, this.rotation, angle);
    } else if (axis == "z") {
        quat.rotateZ(this.rotation, this.rotation, angle);
    }

    this.setDirty();

    return this.rotation;
};

Transform.prototype.getScale = function() {
    return this.scale;
};

Transform.prototype.setScale = function(scale) {
    this.scale = scale;

    this.setDirty();
};
