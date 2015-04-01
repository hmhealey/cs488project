#version 100

precision mediump float;

uniform vec3 lightPosition;
uniform vec4 lightAmbient;
uniform vec4 lightDiffuse;
uniform vec3 lightFalloff;

uniform vec4 materialAmbient;
uniform vec4 materialDiffuse;
uniform sampler2D texture;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;

void main() {
    vec4 ambient = materialAmbient * texture2D(texture, fTexCoord) * lightAmbient;
    vec4 diffuse = materialDiffuse * texture2D(texture, fTexCoord) * lightDiffuse;

    // lightPosition is already in view space
    vec3 surfaceToLight = lightPosition - fPosition;

    vec3 L = normalize(lightPosition - fPosition);

    // ambient lighting
    vec4 iAmbient = ambient;

    // diffuse lighting
    vec4 iDiffuse = diffuse * max(dot(fNormal, L), 0.0);
    iDiffuse = clamp(iDiffuse, 0.0, 1.0);

    // attenuation
    float distanceToLight = length(surfaceToLight);
    float attenuation = 1.0 / (lightFalloff.x + (distanceToLight * lightFalloff.y + distanceToLight * distanceToLight * lightFalloff.z));

    gl_FragColor = iAmbient + attenuation * iDiffuse;
}
