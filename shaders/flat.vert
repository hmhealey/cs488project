#version 100

uniform mat4 modelViewProjection;

attribute vec3 position;
attribute vec2 texCoord;

varying vec2 fTexCoord;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);

    fTexCoord = texCoord;
}
