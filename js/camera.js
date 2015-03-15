function Camera(args) {
    args = args || {};

    this.screenWidth = args['screenWidth'] || 500;
    this.screenHeight = args['screenHidth'] || 500;

    this.fov = args['fov'] || 45;
    this.aspect = args['aspect'] || 1;

    this.near = args['near'] || 0.1;
    this.far = args['far'] || 1000;

    this.position = args['position'] || vec3.fromValues(0, 0, 0);
    this.forward = args['forward'] || vec3.fromValues(0, 0, -1);
    this.up = args['up'] || vec3.fromValues(0, 1, 0);

    this.matrix = mat4.create();
    this.view = mat4.create();
    this.projection = mat4.create();
    this.updateMatrices();
};

Camera.mainCamera = null;

Camera.prototype.updateMatrices = function() {
    mat4.lookAt(this.view, this.position, vec3.add(vec3.create(), this.position, this.forward), this.up);
    mat4.invert(this.matrix, this.view);

    mat4.perspective(this.projection, this.fov * Math.PI / 180, this.aspect, this.near, this.far);
};

Camera.prototype.updateViewport = function() {
    gl.viewport(0, 0, this.screenWidth, this.screenHeight);
};
