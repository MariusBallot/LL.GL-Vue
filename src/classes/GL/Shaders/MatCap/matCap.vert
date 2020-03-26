#version 300 es
in vec4 a_position;	//Making it a vec4, the w component is used as color index from uColor
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

uniform vec3 uColor[6];
out vec2 v_N;

out highp vec2 texCoord;


void main(void){
	texCoord = a_uv;

	vec4 p = a_position;

	vec3 e = normalize( vec3( uMVMatrix * p ) );
    vec3 n = normalize( vec3( uMVMatrix * p ));

  	vec3 r = reflect( e, n );
  	float m = 2. * sqrt(
    	pow( r.x, 2. ) +
    	pow( r.y, 2. ) +
    	pow( r.z + 1., 2. )
  	);
  	v_N = r.xy / m + .5;



	gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0); 
}