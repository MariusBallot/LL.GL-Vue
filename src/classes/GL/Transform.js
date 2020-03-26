import * as glMatrix from 'gl-matrix'
import { Vector3, Matrix4 } from "./Math"

export default class Transform {
    constructor() {
        //transform vectors
        this.position = glMatrix.vec3.create();	//Traditional X,Y,Z 3d position
        this.scale = glMatrix.vec3.create();	//How much to scale a mesh. Having a 1 means no scaling is done.
        glMatrix.vec3.set(this.scale, 1, 1, 1)
        this.rotation = glMatrix.vec3.create();	//Hold rotation values based on degrees, Object will translate it to radians
        this.matView = new Matrix4();		//Cache the results when calling updateMatrix
        this.matNormal = new Float32Array(9);	//This is a Mat3, raw array to hold the values is enough for what its used for

        console.log(this.scale)

        //Direction Vectors, Need 4 elements for math operations with matrices
        this.forward = new Float32Array(4);	//When rotating, keep track of what the forward direction is
        this.up = new Float32Array(4);	//what the up direction is, invert to get bottom
        this.right = new Float32Array(4);	//what the right direction is, invert to get left
    }

    //--------------------------------------------------------------------------
    //Methods
    updateMatrix() {
        this.matView.reset() //Order is very important!!
            .vtranslate(this.position)
            .rotateX(this.rotation[0] * Transform.deg2Rad)
            .rotateZ(this.rotation[1] * Transform.deg2Rad)
            .rotateY(this.rotation[2] * Transform.deg2Rad)
            .vscale(this.scale);

        //Calcuate the Normal Matrix which doesn't need translate, then transpose and inverses the mat4 to mat3
        Matrix4.normalMat3(this.matNormal, this.matView.raw);

        //Determine Direction after all the transformations.
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw); //Z
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.raw); //Y
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.raw); //X

        return this.matView.raw;
    }

    updateDirection() {
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw);
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.raw);
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.raw);
        return this;
    }

    getViewMatrix() { return this.matView.raw; }
    getNormalMatrix() { return this.matNormal; }

    reset() {
        glMatrix.vec3.set(this.position, 0, 0, 0);
        glMatrix.vec3.set(this.scale, 1, 1, 1);
        glMatrix.vec3.set(this.rotation, 0, 0, 0);
    }
}

Transform.deg2Rad = Math.PI / 180; //Cache result, one less operation to do for each update.