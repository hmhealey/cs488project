"use strict";

var gl;

var shader;
var level;

var paused = false;

var lastTick;
var TICK_RATE = 10;

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
        if (!gl.getExtension("OES_element_index_uint")) console.log("Unable to load OES_element_index_uint");
        if (!gl.getExtension("OES_texture_float")) console.log("Unable to load OES_texture_float");
        if (!gl.getExtension("OES_texture_float_linear")) console.log("Unable to load OES_texture_float_linear");

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

    ParticleEmitter.shader = new Shader();
    var particleShaderCallback = function() {
        if (ParticleEmitter.shader.shaders.length == 2) {
            // both shaders have been loaded
            ParticleEmitter.shader.link();
        }
    };
    ParticleEmitter.shader.loadShader(gl.VERTEX_SHADER, "shaders/particles.vert", particleShaderCallback);
    ParticleEmitter.shader.loadShader(gl.FRAGMENT_SHADER, "shaders/particles.frag", particleShaderCallback);

    onFramerate = (function(framerateCounter) {
        return function(fps) {
            framerateCounter.innerText = fps;
        };
    })(document.getElementById("framerateCounter"));

    lastTick = new Date().getTime();
};

var update = function(time) {
    if (shader.linked) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        if (level) {
            level.draw(shader);
        }

        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
    }

    // update input state
    Input.update();

    // update game logic
    if (level) {
        level.update();
    }

    onFrameRendered();

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
    if (e.charCode == 112) {
        paused = !paused;

        if (!paused) {
            // cancel any pending updates first so that we don't end up with duplicate callbacks on each frame
            window.cancelAnimationFrame(update);

            window.requestAnimationFrame(update);

            // reset the last tick time so that we don't simulate the entire game catching up to now
            lastTick = new Date().getTime();
        } else {
            // a hacky way to show in the UI that the game is paused
            window.requestAnimationFrame(function() {
                onFramerate("Paused");
            });
        }
    }
};

var onResize = function(e) {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    gl.viewport(0, 0, screenWidth, screenHeight);

    if (level != null && level.mainCamera != null) {
        level.mainCamera.updateScreenSize(screenWidth, screenHeight);
    }
};

attachEvent(window, "load", onLoad);
attachEvent(window, "unload", onUnload);
