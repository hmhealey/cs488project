"use strict";

var gl;

var texture;

var onLoad = function(e) {
    var canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (gl) {
        initialize();

        setInterval(update, 1000 / 60);
    } else {
        window.alert("Your browser doesn't support WebGL :(");
    }
};

var onUnload = function(e) {
    if (gl) {
        cleanup();
    }
};

var initialize = function(e) {
    gl.clearColor(0.6, 0.6, 0.6, 1.0);

    texture = new Texture();
    texture.setImageFromPath("Ayreon_-_01011001.jpg");
};

var update = function(e) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, 300, 300);

    var shader = new Shader();
    shader.attachShader(gl.VERTEX_SHADER,
        "#version 100\n" +
        "\n" +
        "attribute vec3 position;\n" +
        "attribute vec2 texCoord;\n" +
        "\n" +
        "varying vec2 fTexCoord;\n" +
        "\n" +
        "void main() {\n" +
        "    gl_Position = vec4(position, 1.0);\n" +
        "    fTexCoord = texCoord;\n" +
        "}\n");
    shader.attachShader(gl.FRAGMENT_SHADER,
        "#version 100\n" +
        "\n" +
        "precision mediump float;\n" +
        "\n" +
        "varying vec2 fTexCoord;\n" +
        "\n" +
        "void main() {\n" +
        "    gl_FragColor = vec4(0.0, fTexCoord, 1.0);\n" +
        "}\n");
    shader.link();

    var mesh = new Mesh();

    mesh.setVertices([
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
    ]);

    mesh.setTexCoords([
        0.5, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ]);

    mesh.draw(shader);

    mesh.cleanup();
    shader.cleanup();
};

var cleanup = function() {
    texture.cleanup();
};

attachEvent(window, "load", onLoad);
attachEvent(window, "unload", onUnload);
