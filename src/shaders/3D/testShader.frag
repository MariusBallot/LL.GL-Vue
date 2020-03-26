#version 300 es
precision mediump float;
		
in highp vec2 texCoord;
uniform float uTime;
		
out vec4 finalColor;
void main(void){			
	finalColor = vec4(texCoord,sin(uTime*0.001),1.);
}