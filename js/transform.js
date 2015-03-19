function Transform(entity, args) {
    args = args || {};

    this.entity = entity;

    this.parent = args['parent'] || null;
    this.children = args['children'] || [];

    // local transformations
    this.position = args['position'] || vec3.create();
    this.rotation = args['rotation'] || quat.create();
    this.scale = args['scale'] || vec3.create();

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
        mat4.fromRotationTranslation(this.matrix, this.position, this.rotation);
        mat4.scale(this.matrix, this.matrix, this.scale);

        this.dirty = false;
    }

    return this.matrix;
};

Transform.prototype.getLocalToWorldMatrix = function() {
    if (this.localToWorldDirty) {
        if (parent) {
            mat4.multiply(this.localToWorld, parent.getLocalToWorldMatrix(), this.matrix);
        } else {
            mat4.set(this.localToWorld, this.matrix);
        }

        this.localToWorldDirty = false;
    }

    return this.localToWorld;
};

Transform.prototype.getWorldToLocalMatrix = function() {
    if (this.worldToLocalDirty) {
        mat4.inverse(this.worldToLocal, this.getLocalToWorldMatrix());

        this.worldToLocalDirty = false;
    }

    return this.worldToLocal;
};

Transform.prototype.setPosition = function(position) {
    this.position = position;

    this.setDirty();
};

Transform.prototype.setRotation = function(rotation) {
    this.rotation = rotation;

    this.setDirty();
};

Transform.prototype.setScale = function(scale) {
    this.scale = scale;

    this.setDirty();
};
