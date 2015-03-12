#version 100

attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;

void main() {
    gl_Position = vec4(position, 1.0);

    fPosition = position;
    fNormal = normal;
    fTexCoord = texCoord;
}
