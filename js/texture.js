function Texture(target) {
    this.target = target || gl.TEXTURE_2D;
    this.texture = gl.createTexture();
    this.loaded = true;
};

Texture.LOG_TEXTURE_LOADING = false;

Texture.prototype.cleanup = function() {
    if (this.texture) {
        gl.deleteTexture(this.texture);
        this.texture = null;
    }
};

Texture.prototype.setImageFromPath = function(path, width, height) {
    var image = new Image(width, height);
    this.setImageOnLoad(image);
    this.loaded = false;
    image.src = path;
};

Texture.prototype.setImageOnLoad = function(image) {
    attachEvent(image, "load", (function(texture, image) {
        return function() {
            texture.setImage(image);
            texture.loaded = true;

            if (Texture.LOG_TEXTURE_LOADING) {
                console.log("Texture.setImageOnLoad - Loaded image " + image.src);
            }
        }
    })(this, image));
};

Texture.prototype.setImage = function(image) {
    gl.bindTexture(this.target, this.texture);

    gl.texImage2D(this.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(this.target, null);

    return this;
};

Texture.prototype.bind = function() {
    gl.bindTexture(this.target, this.texture);
};

Texture.prototype.release = function() {
    gl.bindTexture(this.target, null);
};
