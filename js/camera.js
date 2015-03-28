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

    this.projection = mat4.create();

    this.updateProjectionMatrix();
};

// make Camera inherit from Entity
Camera.prototype = Object.create(Entity.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.getViewMatrix = function() {
    return this.transform.getWorldToLocalMatrix();
};

Camera.prototype.getProjectionMatrix = function() {
    return this.projection;
};

Camera.prototype.setVerticalFov = function(fov) {
    this.fov = fov;
    this.updateProjectionMatrix();
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
    // just recurse since cameras aren't visible in the world
    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.draw();
    }
};
