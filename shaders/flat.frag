#version 100

precision mediump float;

uniform vec4 materialDiffuse;
uniform sampler2D texture;

varying vec2 fTexCoord;

void main() {
    gl_FragColor = materialDiffuse * texture2D(texture, fTexCoord);
}
