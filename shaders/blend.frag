#version 100

precision mediump float;

uniform vec4 materialAmbient;
uniform vec4 materialDiffuse;
uniform vec4 materialSpecular;
uniform float materialShininess;
uniform sampler2D texture;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec2 fTexCoord2;
varying vec2 fTexCoord3;
varying vec2 fTexCoord4;
varying vec4 fTexWeights;

void main() {
    // TODO set the light components as uniforms r something
    vec4 ambient = materialAmbient * vec4(0.1, 0.1, 0.1, 1.0);
    vec4 diffuse = materialDiffuse * vec4(0.8, 0.8, 0.8, 1.0) *
                   (fTexWeights.x * texture2D(texture, fTexCoord) +
                    fTexWeights.y * texture2D(texture2, fTexCoord2) +
                    fTexWeights.z * texture2D(texture3, fTexCoord3) + 
                    fTexWeights.w * texture2D(texture4, fTexCoord4));
    vec4 specular = materialSpecular * vec4(0.4, 0.4, 0.4, 1.0);
    float shininess = materialShininess;

    // for simplicity, the light is just located at the eyepoint
    vec3 L = normalize(vec3(0, 0, 4) - fPosition);
    vec3 E = normalize(-fPosition);
    vec3 R = normalize(-reflect(L, fNormal));

    // ambient lighting
    vec4 iAmbient = ambient;

    // diffuse lighting
    vec3 surfaceToLight = normalize(L - fPosition);

    vec4 iDiffuse = diffuse * max(dot(fNormal, L), 0.0);
    iDiffuse = clamp(iDiffuse, 0.0, 1.0);

    // specular lighting
    vec4 iSpecular = specular * pow(max(dot(R, E), 0.0), 0.3 * shininess);
    iSpecular = clamp(iSpecular, 0.0, 1.0);

    gl_FragColor = iAmbient + iDiffuse + iSpecular;
}
