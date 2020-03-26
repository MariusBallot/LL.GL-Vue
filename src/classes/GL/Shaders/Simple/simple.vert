#version 300 es
in vec4 a_position;	//Making it a vec4, the w component is used as color index from uColor
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

uniform vec3 uColor[6];

out highp vec2 texCoord;


void main(void){
	texCoord = a_uv;

	gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0); 
}