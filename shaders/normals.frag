#version 100

precision mediump float;

varying vec3 fPosition;
varying vec3 fNormal;

void main() {
    gl_FragColor = vec4(fNormal, 1.0);
}
