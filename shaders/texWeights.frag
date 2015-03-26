#version 100

precision mediump float;

varying vec4 fTexWeights;

void main() {
    gl_FragColor = vec4(fTexWeights.rgb, 1.0);
}
