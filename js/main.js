"use strict";

var gl;
var ext;

var shader;
var level;

var paused = false;

var onLoad = function(e) {
    var canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (gl) {
        // attach other events
        attachEvent(window, "keypress", onKeyPress);
        attachEvent(window, "keydown", Input.onKeyDown);
        attachEvent(window, "keyup", Input.onKeyUp);
        attachEvent(window, "resize", onResize);

        // load required extensions
        ext = gl.getExtension("OES_element_index_uint");

        // perform initialization
        initialize();
        Input.initialize();

        // update the camera with the new window size
        onResize(null);

        // start rendering
        window.requestAnimationFrame(update);
    } else {
        window.alert("Your browser doesn't support WebGL :(");
    }
};

var initialize = function() {
    gl.clearColor(0.6, 0.6, 0.6, 1.0);

    loadLevel("test");

    shader = new Shader();
    var shaderCallback = function() {
        if (shader.shaders.length == 2) {
            // both shaders have been loaded
            shader.link();
        }
    };
    shader.loadShader(gl.VERTEX_SHADER, "shaders/phong.vert", shaderCallback);
    shader.loadShader(gl.FRAGMENT_SHADER, "shaders/phong.frag", shaderCallback);

    onFramerate = (function(framerateCounter) {
        return function(fps) {
            framerateCounter.innerText = fps;
        };
    })(document.getElementById("framerateCounter"));
};

var rotation = 0;

var update = function(time) {
    if (shader.linked) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        shader.bind();

        // update camera matrices
        shader.setCamera(level.mainCamera);

        // draw the scene
        if (level != null && level.root != null) {
            level.root.draw(shader, mat4.create());
        }

        shader.release();

        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
    }

    onFrameRendered();

    Input.update();

    if (!paused) {
        window.requestAnimationFrame(update);
    }
};

var cleanup = function() {
    texture.cleanup();
};

var onUnload = function(e) {
    if (gl) {
        cleanup();
    }
};

var onKeyPress = function(e) {
    paused = !paused;

    if (!paused) {
        // cancel any pending updates first so that we don't end up with duplicate callbacks on each frame
        window.cancelAnimationFrame(update);
        window.requestAnimationFrame(update);

        console.log("rendering has been unpaused");
    } else {
        console.log("rendering has been paused");
    }
};

var onResize = function(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (level != null && level.mainCamera != null) {
        level.mainCamera.updateScreenSize();
    }
};

attachEvent(window, "load", onLoad);
attachEvent(window, "unload", onUnload);
