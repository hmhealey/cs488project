#version 100

uniform mat4 modelView;
uniform mat4 modelViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
attribute vec4 colour;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec4 fColour;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);

    fPosition = vec3(modelView * vec4(position, 1.0));
    fNormal = normalize(normalMatrix * normal);
    fTexCoord = texCoord;

    fColour = colour;

    gl_PointSize = 10.0;
}
