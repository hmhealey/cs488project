function Camera(args) {
    args = args || {};

    // call super constructor
    Entity.call(this, args);

    this.screenWidth = args['screenWidth'] || 500;
    this.screenHeight = args['screenHidth'] || 500;

    this.fov = args['fov'] || 45;
    this.aspect = args['aspect'] || 1;

    this.near = args['near'] || 0.1;
    this.far = args['far'] || 1000;

    this.view = mat4.create();
    this.projection = mat4.create();

    this.updateProjectionMatrix();
    this.updateViewMatrix();
};

// make Camera inherit from Entity
Camera.prototype = Object.create(Entity.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.translate = function(amount) {
    Entity.prototype.translate.apply(this, amount);
    this.updateViewMatrix();
};

Camera.prototype.rotate = function(axis, angle) {
    Entity.prototype.rotate.apply(this, axis, angle);
    this.updateViewMatrix();
};

Camera.prototype.setTransform = function(transform) {
    Entity.prototype.setTransform.apply(this, transform);
    this.updateViewMatrix();
};

Camera.prototype.updateViewMatrix = function() {
    mat4.invert(this.view, this.transform);
};

Camera.prototype.setVerticalFov = function(fov) {
    this.fov = fov;
    this.updatePerspectiveMatrix();
};

Camera.prototype.setAspectRatio = function(aspect) {
    this.aspect = aspect;
    this.updatePerspectiveMatrix();
};

Camera.prototype.setNearFarPlanes = function(near, far) {
    this.near = near;
    this.far = far;
    this.updatePerspectiveMatrix();
}

Camera.prototype.updateScreenSize = function(screenWidth, screenHeight) {
    this.screenWidth = screenWidth || window.innerWidth;
    this.screenHeight = screenHeight || window.innerHeight;
    this.aspect = this.screenWidth / this.screenHeight;

    this.updateProjectionMatrix();
};

Camera.prototype.updateProjectionMatrix = function() {
    mat4.perspective(this.projection, this.fov * Math.PI / 180, this.aspect, this.near, this.far);
};

Camera.prototype.draw = function() {
    // do nothing since cameras aren't visible in the world
};
