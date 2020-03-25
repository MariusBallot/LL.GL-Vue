import vertSource from "../../shaders/3D/testShader.vert"
import fragSource from "../../shaders/3D/testShader.frag"

import { GlUtil } from './gl'

const ATTR_POSITION_NAME = "a_position";
const ATTR_POSITION_LOC = 0;
const ATTR_NORMAL_NAME = "a_norm";
const ATTR_NORMAL_LOC = 1;
const ATTR_UV_NAME = "a_uv";
const ATTR_UV_LOC = 2;

export default class Shader {
    constructor(gl, vertShaderSrc, fragShaderSrc) {
        this.program = ShaderUtil.createProgramFromText(gl, vertShaderSrc, fragShaderSrc, true);

        if (this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getStandardAttribLocations(gl, this.program);
            this.uniformLoc = ShaderUtil.getStandardUniformLocations(gl, this.program);
        }

        //Note :: Extended shaders should deactivate shader when done calling super and setting up custom parts in the constructor.
    }

    //...................................................
    //Methods
    activate() { this.gl.useProgram(this.program); return this; }
    deactivate() { this.gl.useProgram(null); return this; }

    setPerspective(matData) { this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); return this; }
    setModalMatrix(matData) { this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); return this; }
    setCameraMatrix(matData) { this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); return this; }

    //function helps clean up resources when shader is no longer needed.
    dispose() {
        //unbind the program if its currently active
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    //...................................................
    //RENDER RELATED METHODS

    //Setup custom properties
    preRender() { } //abstract method, extended object may need need to do some things before rendering.

    //Handle rendering a modal
    renderModal(modal) {
        this.setModalMatrix(modal.transform.getViewMatrix());	//Set the transform, so the shader knows where the modal exists in 3d space
        this.gl.bindVertexArray(modal.mesh.vao);				//Enable VAO, this will set all the predefined attributes for the shader

        if (modal.mesh.noCulling) this.gl.disable(this.gl.CULL_FACE);
        if (modal.mesh.doBlending) this.gl.enable(this.gl.BLEND);

        if (modal.mesh.indexCount) this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);

        //Cleanup
        this.gl.bindVertexArray(null);
        if (modal.mesh.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if (modal.mesh.doBlending) this.gl.disable(this.gl.BLEND);

        return this;
    }
}


class ShaderUtil {
    //-------------------------------------------------
    // Main utility functions
    //-------------------------------------------------

    //get the text of a script tag that are storing shader code.
    static domShaderSrc(elmID) {
        var elm = document.getElementById(elmID);
        if (!elm || elm.text == "") { console.log(elmID + " shader not found or no text."); return null; }

        return elm.text;
    }

    //Create a shader by passing in its code and what type
    static createShader(gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        //Get Error data if shader failed compiling
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    //Link two compiled shaders to create a program for rendering.
    static createProgram(gl, vShader, fShader, doValidate) {
        //Link shaders together
        var prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);

        //Force predefined locations for specific attributes. If the attibute isn't used in the shader its location will default to -1
        gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);

        gl.linkProgram(prog);

        //Check if successful
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog); return null;
        }

        //Only do this for additional debugging.
        if (doValidate) {
            gl.validateProgram(prog);
            if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.error("Error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog); return null;
            }
        }

        //Can delete the shaders since the program has been made.
        gl.detachShader(prog, vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
        gl.detachShader(prog, fShader);
        gl.deleteShader(fShader);
        gl.deleteShader(vShader);

        return prog;
    }

    //-------------------------------------------------
    // Helper functions
    //-------------------------------------------------

    //Pass in Script Tag IDs for our two shaders and create a program from it.
    static domShaderProgram(gl, vectID, fragID, doValidate) {
        var vShaderTxt = ShaderUtil.domShaderSrc(vectID); if (!vShaderTxt) return null;
        var fShaderTxt = ShaderUtil.domShaderSrc(fragID); if (!fShaderTxt) return null;
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER); if (!vShader) return null;
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER); if (!fShader) { gl.deleteShader(vShader); return null; }

        return ShaderUtil.createProgram(gl, vShader, fShader, true);
    }

    static createProgramFromText(gl, vShaderTxt, fShaderTxt, doValidate) {
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER); if (!vShader) return null;
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER); if (!fShader) { gl.deleteShader(vShader); return null; }

        return ShaderUtil.createProgram(gl, vShader, fShader, true);
    }

    //-------------------------------------------------
    // Setters / Getters
    //-------------------------------------------------

    //Get the locations of standard Attributes that we will mostly be using. Location will = -1 if attribute is not found.
    static getStandardAttribLocations(gl, program) {
        return {
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv: gl.getAttribLocation(program, ATTR_UV_NAME)
        };
    }

    static getStandardUniformLocations(gl, program) {
        return {
            perspective: gl.getUniformLocation(program, "uPMatrix"),
            modalMatrix: gl.getUniformLocation(program, "uMVMatrix"),
            cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix"),
            mainTexture: gl.getUniformLocation(program, "uMainTex")
        };
    }
}

export class GridAxisShader extends Shader {
    constructor(gl, pMatrix) {
        var vertSrc = '#version 300 es\n' +
            'in vec3 a_position;' +
            'layout(location=4) in float a_color;' +
            'uniform mat4 uPMatrix;' +
            'uniform mat4 uMVMatrix;' +
            'uniform mat4 uCameraMatrix;' +
            'uniform vec3 uColor[4];' +
            'out lowp vec4 color;' +
            'void main(void){' +
            'color = vec4(uColor[ int(a_color) ],1.0);' +
            'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);' +
            '}';
        var fragSrc = '#version 300 es\n' +
            'precision mediump float;' +
            'in vec4 color;' +
            'out vec4 finalColor;' +
            'void main(void){ finalColor = color; }';

        super(gl, vertSrc, fragSrc);

        //Standrd Uniforms
        this.setPerspective(pMatrix);

        //Custom Uniforms 
        console.log(this.program)
        var uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(uColor, new Float32Array([0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]));

        //Cleanup
        gl.useProgram(null);
    }
}

export class TestShader extends Shader {
    constructor(gl, pMatrix) {
        var vertSrc = vertSource,
            fragSrc = fragSource
        super(gl, vertSrc, fragSrc);

        //Custom Uniforms
        console.log(this.program)
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
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture);
        this.gl.uniform1i(this.uniformLoc.mainTexture, 0); //Our predefined uniformLoc.mainTexture is uMainTex, Prev Lessons we made ShaderUtil.getStandardUniformLocations() function in Shaders.js to get its location.

        return this;
    }
}