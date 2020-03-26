import Transform from './Transform'
import * as glMatrix from 'gl-matrix'

export default class Modal {
    constructor(meshData) {
        this.transform = new Transform();
        this.mesh = meshData;
    }

    //--------------------------------------------------------------------------
    //Getters/Setters
    setScale(x, y, z) { glMatrix.vec3.set(this.transform.scale, x, y, z); return this; }
    // setPosition(x, y, z) { this.transform.position.set(x, y, z); return this; }
    setPosition(x, y, z) { glMatrix.vec3.set(this.transform.position, x, y, z); return this; }
    // setRotation(x, y, z) { this.transform.rotation.set(x, y, z); return this; }
    setRotation(x, y, z) { glMatrix.vec3.set(this.transform.rotation, x, y, z); return this; }

    addScale(x, y, z) { this.transform.scale[0] += x; this.transform.scale[1] += y; this.transform.scale[2] += z; return this; }
    addPosition(x, y, z) { this.transform.position[0] += x; this.transform.position[1] += y; this.transform.position[2] += z; return this; }
    addRotation(x, y, z) { this.transform.rotation[0] += x; this.transform.rotation[1] += y; this.transform.rotation[2] += z; return this; }

    //--------------------------------------------------------------------------
    //Things to do before its time to render
    preRender() { this.transform.updateMatrix(); return this; }
}