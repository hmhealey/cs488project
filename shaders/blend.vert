#version 100

uniform mat4 modelView;
uniform mat4 modelViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
attribute vec2 texCoord2;
attribute vec2 texCoord3;
attribute vec2 texCoord4;
attribute vec4 texWeights;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec2 fTexCoord2;
varying vec2 fTexCoord3;
varying vec2 fTexCoord4;
varying vec4 fTexWeights;

void main() {
    gl_Position = modelViewProjection * vec4(position, 1.0);

    fPosition = vec3(modelView * vec4(position, 1.0));
    fNormal = normalize(normalMatrix * normal);

    fTexCoord = texCoord;
    fTexCoord2 = texCoord2;
    fTexCoord3 = texCoord3;
    fTexCoord4 = texCoord4;
    fTexWeights = normalize(texWeights);
}
