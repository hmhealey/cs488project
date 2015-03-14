#version 100

precision mediump float;

varying vec2 fTexCoord;

void main() {
    gl_FragColor = vec4(fTexCoord, 0.0, 1.0);
}
