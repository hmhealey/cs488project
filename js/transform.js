function Transform(entity, args) {
    args = args || {};

    this.entity = entity;

    // stores node hierarchy
    this.parent = args["parent"] || null;
    this.children = args["children"] || [];

    if ("parent" in args) {
        this.setParent(args["parent"]);
    }

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

    // vectors storing the facing of the transform
    this.forward = vec3.create();
    this.up = vec3.create();
    this.right = vec3.create();
    this.facingsDirty = true;
};

Transform.prototype.setParent = function(parent) {
    // remove us as a child of our existing parent
    if (this.parent) {
        removeFromArray(this.parent.children, this);
    }

    this.parent = parent;

    // add us as a child of our existing parent
    if (parent)  {
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

Transform.prototype.updateFacings = function() {
    var matrix = this.getMatrix();

    vec3.set(this.forward, 0, 0, -1);
    vec3.transformQuat(this.forward, this.forward, matrix);

    vec3.set(this.up, 0, 1, 0);
    vec3.transformQuat(this.up, this.up, matrix);

    vec3.set(this.right, 1, 0, 0);
    vec3.transformQuat(this.right, this.right, matrix);

    this.facingsDirty = false;
};

Transform.prototype.getForward = function() {
    if (this.facingsDirty) {
        this.updateFacings();
    }

    return this.forward;
};

Transform.prototype.getUp = function() {
    if (this.facingsDirty) {
        this.updateFacings();
    }

    return this.up;
};

Transform.prototype.getRight = function() {
    if (this.facingsDirty) {
        this.updateFacings();
    }

    return this.right;
};
