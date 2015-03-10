var gl;

var onLoad = function(e) {
    var canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (gl) {
        initialize();

        update(); // only update once while we're testing and not actually doing anything that changes
        //setInterval(update, 1000 / 60);
    } else {
        window.alert("Your browser doesn't support WebGL :(");
    }
};

var initialize = function(e) {
    gl.clearColor(0.6, 0.6, 0.6, 1.0);
};

var update = function(e) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, 300, 300);

    var shader = new Shader(gl);
    shader.addShader(gl.VERTEX_SHADER,
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
    shader.addShader(gl.FRAGMENT_SHADER,
        "#version 100\n" +
        "\n" +
        "precision mediump float;\n" +
        "\n" +
        "varying vec2 fTexCoord;\n" +
        "\n" +
        "void main() {\n" +
        "    gl_FragColor = vec4(0.0, fTexCoord, 1.0);\n" +
        "}\n");
    shader.initialize();

    var mesh = new Mesh(gl);
    mesh.initialize();

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

attachEvent(window, "load", onLoad);
