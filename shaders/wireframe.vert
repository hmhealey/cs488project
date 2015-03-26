#version 100

uniform mat4 modelViewProjection;

attribute vec3 position;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);
}
