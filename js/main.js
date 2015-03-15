"use strict";

var gl;
var ext;

var camera;
var shader;
var texture;

var paused = false;

var onLoad = function(e) {
    var canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (gl) {
        // attach other events
        attachEvent(window, "keypress", onKeyPress);
        attachEvent(window, "keydown", onKeyDown);
        attachEvent(window, "keyup", onKeyUp);

        // load required extensions
        ext = gl.getExtension("OES_element_index_uint");

        // perform opengl initialization
        initialize();

        // start rendering
        window.requestAnimationFrame(update);
    } else {
        window.alert("Your browser doesn't support WebGL :(");
    }
};

var initialize = function() {
    gl.clearColor(0.6, 0.6, 0.6, 1.0);

    camera = new Camera({
        screenWidth: 500,
        screenHeight: 500,
        fov: 45,
        aspect: 1,
        near: 0.1,
        far: 100,
        position: vec3.fromValues(0, 0, 0),
        view: vec3.fromValues(0, 0, -1),
        up: vec3.fromValues(0, 1, 0)
    });

    shader = new Shader();
    var shaderCallback = function() {
        if (shader.shaders.length == 2) {
            // both shaders have been loaded
            shader.link();
        }
    };
    shader.loadShader(gl.VERTEX_SHADER, "shaders/phong.vert", shaderCallback);
    shader.loadShader(gl.FRAGMENT_SHADER, "shaders/phong.frag", shaderCallback);

    texture = new Texture();
    texture.setImageFromPath("Ayreon_-_01011001.jpg");
};

var rotation = 0;

var update = function(time) {
    if (shader.linked && texture.loaded) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, camera.screenWidth, camera.screenHeight);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        shader.bind();

        // update camera matrices
        var model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(0, 0, -10));
        mat4.rotateX(model, model, Math.PI / 6);
        mat4.rotateY(model, model, rotation);
        rotation += Math.PI / 120;

        var modelView = mat4.create();
        mat4.multiply(modelView, camera.view, model);

        var modelViewProjection = mat4.create();
        mat4.multiply(modelViewProjection, camera.projection, modelView);

        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelView);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, "modelView"), false, modelView);
        gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, "modelViewProjection"), false, modelViewProjection);
        gl.uniformMatrix3fv(gl.getUniformLocation(shader.program, "normalMatrix"), false, normalMatrix);

        //var mesh = Mesh.makeSquare(1);
        //var mesh = Mesh.makeCube(1);
        var mesh = Mesh.makeUvSphere(1, 20, 20);

        gl.useProgram(shader.program);

        var material = new Material({
            //diffuse: vec4.fromValues(1.0, 0.0, 0.0, 1.0),
            texture: texture,
            specular: vec4.fromValues(1.0, 1.0, 1.0, 1.0),
            shininess: 10
        });
        material.applyTo(shader);

        mesh.draw(shader);

        mesh.cleanup();

        shader.release();

        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
    }

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

var onKeyDown = function(e) { };

var onKeyUp = function(e) { };

attachEvent(window, "load", onLoad);
attachEvent(window, "unload", onUnload);
