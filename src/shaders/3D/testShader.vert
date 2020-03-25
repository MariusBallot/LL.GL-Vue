#version 300 es
in vec4 a_position;	//Making it a vec4, the w component is used as color index from uColor
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

uniform vec3 uColor[6];
uniform float uTime;

out lowp vec4 color;
out highp vec2 texCoord;  //Interpolate UV values to the fragment shader
		
vec3 warp(vec3 p){
	//return p + 0.2 * abs(cos(uTime*0.002)) * a_norm;
	//return p + 0.5 * abs(cos(uTime*0.003 + p.y)) * a_norm;
	return p + 0.5 * abs(cos(uTime*0.003 + p.y*2.0 + p.x*2.0 + p.z)) * a_norm;
}

void main(void){
	texCoord = a_uv;
	color = vec4(uColor[ int(a_position.w) ],1.0);
	// gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(warp(a_position.xyz), 1.0); 
	gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0); 
}