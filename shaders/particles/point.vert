#version 100

uniform mat4 modelViewProjection;

uniform mediump float pointSize;

attribute vec3 offset;
attribute vec4 colour;

varying vec4 fColour;

void main() {
    gl_Position = modelViewProjection * vec4(offset, 1.0);

    fColour = colour;

    gl_PointSize = pointSize;
}
