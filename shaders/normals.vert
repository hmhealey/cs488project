#version 100

uniform mat4 modelView;
uniform mat4 modelViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 fPosition;
varying vec3 fNormal;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);

    fPosition = vec3(modelView * vec4(position, 1.0));
    fNormal = normalize(normalMatrix * normal);
    //fNormal = normal;
}
