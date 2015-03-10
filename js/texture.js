function Texture() {
    this.texture = gl.createTexture();
};

Texture.prototype.cleanup = function() {
    if (this.texture) {
        gl.deleteTexture(this.texture);
        this.texture = null;
    }
};

Texture.prototype.setImageFromPath = function(path, width, height) {
    var image = new Image(width, height);
    this.setImageOnLoad(image);
    image.src = path;
};

Texture.prototype.setImageOnLoad = function(image) {
    attachEvent(image, "load", (function(texture, image) {
        return function() {
            texture.setImage(image);
        }
    })(this, image));
};

Texture.prototype.setImage = function(image) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
};

