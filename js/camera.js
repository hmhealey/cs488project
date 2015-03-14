function Camera(args) {
    this.screenWidth = args['screenWidth'] || 500;
    this.screenheight = args['screenWidth'] || 500;

    this.fov = args['fov'] || 45;
    this.aspect = args['aspect'] || 1;

    this.near = args['near'] || 0.1;
    this.far = args['far'] || 1000;

    this.position = args['position'] || vec3.fromValues(0, 0, 0);
    this.forward = args['forward'] || vec3.fromValues(0, 0, -1);
    this.up = args['up'] || vec3.fromValues(0, 1, 0);

    this.matrix = null;
    this.view = null;
    this.projection = null;
    this.updateMatrices();
};

Camera.prototype.updateMatrices = function() {
    this.matrix = mat4.lookAt(mat4.create(), this.position,
                              vec3.add(vec3.create(), this.position, this.forward), this.up);
    this.view = mat4.invert(mat4.create(), this.matrix);

    this.projection = mat4.create();
    mat4.perspective(this.projection, this.fov * Math.PI / 180, this.aspect, this.near, this.far);
}
