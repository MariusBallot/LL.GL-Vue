#version 300 es
precision mediump float;
		
in vec4 color;
in highp vec2 texCoord;		//What pixel to pull from the texture
uniform sampler2D uMainTex;	//Holds the texture we loaded to the GPU
uniform sampler2D uMatCap;	//Holds the texture we loaded to the GPU
uniform float uTime;

in vec2 v_N;

		
out vec4 finalColor;
void main(void){			//Confusing that UV's coords are S,T but in all honestly it works just like X,Y
	// finalColor = color;
	finalColor = vec4(texCoord,sin(uTime*0.001),1.);
	finalColor = texture(uMatCap,v_N);	//Just The Texture
	// finalColor = vec4(v_N, 1.,1.);
	
	//finalColor = color * texture(uMainTex,texCoord); //Mixing Texture and Color together
	//finalColor = color * texture(uMainTex,texCoord) * 1.5f; //Making the colors brighter
	//finalColor = color + texture(uMainTex,texCoord); //Mixing the color and textures with addition,Dif effect
	//finalColor = mix(color,texture(uMainTex,texCoord),0.8f); //Using mix func to fade between two pixel colors.
} 