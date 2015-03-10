var gl;

window.addEventListener("load", function(e) {
    console.log("bbb");
    document.getElementById("hello").style.color = "#ff0000";

    var canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (gl) {
        gl.clearColor(0.0, 0.5, 0.5, 1.0);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    } else {
        window.alert("Your browser doesn't support WebGL :(");
    }
});
