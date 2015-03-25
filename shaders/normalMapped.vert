#version 100

uniform mat4 modelView;
uniform mat4 modelViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 tangent;
attribute vec2 texCoord;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 fTangent;
varying vec3 fBittangent;
varying vec2 fTexCoord;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);

    fPosition = vec3(modelView * vec4(position, 1.0));
    fNormal = normalize(normalMatrix * normal);
    fTangent = normalize(normalMatrix * tangent);
    fBittangent = normalize(normalMatrix * cross(normal, tangent));
    fTexCoord = texCoord;
}
