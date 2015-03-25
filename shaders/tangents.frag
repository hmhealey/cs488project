#version 100

precision mediump float;

varying vec3 fTangent;

void main() {
    gl_FragColor = vec4((fTangent + vec3(1.0, 1.0, 1.0)) / 2.0, 1.0);
}
