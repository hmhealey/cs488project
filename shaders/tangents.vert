#version 100

uniform mat4 modelViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 tangent;

varying vec3 fTangent;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);

    fTangent = normalize(normalMatrix * tangent);
}
