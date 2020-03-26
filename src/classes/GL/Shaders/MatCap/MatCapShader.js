import { GlUtil } from '../../gl'

import Shader from "../Shader"

import vertSource from "./matCap.vert"
import fragSource from "./matCap.frag"

import TextureLoader from '../../TextureLoader'

export default class MatCap extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vertSource, fragSource);

        TextureLoader.load(gl, "matCap", "/matCap.png", true, (tex) => {
            console.log(tex)
            this.matCapTex = tex
            this.uniformLoc.matCap = gl.getUniformLocation(this.program, "uMatCap");

        })

        //Custom Uniforms
        this.uniformLoc.time = gl.getUniformLocation(this.program, "uTime");

        var uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(
            uColor,
            new Float32Array(
                GlUtil.rgbArray(
                    "#FF0000",
                    "00FF00",
                    "0000FF",
                    "909090",
                    "C0C0C0",
                    "404040"
                )
            )
        );

        //Standrd Uniforms
        this.setPerspective(pMatrix);
        this.mainTexture = -1; //Store Our Texture ID
        gl.useProgram(null); //Done setting up shader
    }

    setTime(t) {
        this.gl.uniform1f(this.uniformLoc.time, t);
        return this;
    }
    setTexture(texID) {
        this.mainTexture = texID;
        return this;
    }

    //Override
    preRender() {
        //Setup Texture
        if (this.matCapTex != undefined) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.matCapTex);
            this.gl.uniform1i(this.uniformLoc.matCap, 0); //Our predefined uniformLoc.mainTexture is uMainTex, Prev Lessons we made ShaderUtil.getStandardUniformLocations() function in Shaders.js to get its location.
        }

        return this;
    }
}