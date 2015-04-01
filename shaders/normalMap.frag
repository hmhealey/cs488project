#version 100

precision mediump float;

uniform vec3 lightPosition;
uniform vec4 lightAmbient;
uniform vec4 lightDiffuse;
uniform vec4 lightSpecular;
uniform vec3 lightFalloff;

uniform vec4 materialAmbient;
uniform vec4 materialDiffuse;
uniform vec4 materialSpecular;
uniform float materialShininess;

uniform sampler2D texture;
uniform sampler2D normalMap;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 fTangent;
varying vec3 fBittangent;
varying vec2 fTexCoord;

void main() {
    // calculate the new normal using the normal map
    mat3 tangentToImageSpace = mat3(fTangent, fBittangent, fNormal);
    vec3 normal = normalize(tangentToImageSpace * (texture2D(normalMap, fTexCoord).rgb * 2.0 - 1.0));

    vec4 ambient = materialAmbient * lightAmbient;
    vec4 diffuse = materialDiffuse * texture2D(texture, fTexCoord) * lightDiffuse;
    vec4 specular = materialSpecular * lightSpecular;
    float shininess = materialShininess;

    // lightPosition is already translated to eye space
    vec3 surfaceToLight = lightPosition - fPosition;

    vec3 L = normalize(surfaceToLight);
    vec3 E = normalize(-fPosition);
    vec3 R = normalize(-reflect(L, normal));

    // ambient lighting
    vec4 iAmbient = ambient;

    // diffuse lighting
    vec4 iDiffuse = diffuse * max(dot(normal, L), 0.0);
    iDiffuse = clamp(iDiffuse, 0.0, 1.0);

    // specular lighting
    vec4 iSpecular = specular * pow(max(dot(R, E), 0.0), 0.3 * shininess);
    iSpecular = clamp(iSpecular, 0.0, 1.0);

    // attenuation
    float distanceToLight = length(surfaceToLight);
    float attenuation = 1.0 / (lightFalloff.x + (distanceToLight * lightFalloff.y + distanceToLight * distanceToLight * lightFalloff.z));

    gl_FragColor = iAmbient + attenuation * (iDiffuse + iSpecular);
}
