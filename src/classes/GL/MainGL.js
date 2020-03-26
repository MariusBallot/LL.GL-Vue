import FileLoader from './FileLoader'
import ObjLoader from './ObjLoader'

import Camera from "./Camera";
import Modal from "./Modal";
import GLInstance from "./gl";
import CameraController from "./Camera";
import { GridAxisShader, TestShader } from "./Shader";
import Primatives from "./Primatives";


import RAF from "../../utils/RAF";

import * as glMatrix from "gl-matrix";

class MainGL {
    init(canvas) {
        this.bind()
        this.gGridModal;
        this.gCamera
        this.gGridShader
        this.gModal
        this.gShader
        // this.objLoader = new ObjLoader()

        this.gl = GLInstance(canvas)
            .fFitScreen(1, 1)
            .fClear();

        FileLoader.load('icos.obj', (txt) => {
            // console.log(txt)
            let d = ObjLoader.parseObjText(txt, true)
            this.icos = new Modal(this.gl.fCreateMeshVAO('icos', d[0], d[1], d[2], d[3], 3));
        })

        //Main Setup

        this.gCamera = new Camera(this.gl);

        glMatrix.vec3.set(this.gCamera.transform.position, 0, 0, 10);


        //Setup Grid
        this.gGridShader = new GridAxisShader(this.gl, this.gCamera.projectionMatrix);
        this.gGridModal = Primatives.GridAxis.createModal(this.gl, false);


        //....................................
        //Setup Test Shader, Modal, Meshes
        this.gShader = new TestShader(this.gl, this.gCamera.projectionMatrix);
        //.setTexture(this.gl.mTextureCache["tex001"]);

        this.gModal = Primatives.Cube.createModal(this.gl);
        this.gModal.setPosition(0, 0.6, 0);

        //....................................
        //Start Rendering
        RAF.subscribe("glRenderLoop", this.render);
        //onRender(0);
    }

    render() {
        let x = Math.sin(Date.now() * 0.001) * 10
        let z = Math.cos(Date.now() * 0.001) * 10

        // glMatrix.vec3.set(this.gCamera.transform.position, x, 0, z)

        this.gModal.addRotation(1, 1, 0);

        this.gCamera.updateViewMatrix();
        this.gl.fClear();
        this.gGridShader
            .activate()
            .setCameraMatrix(this.gCamera.viewMatrix)
            .renderModal(this.gGridModal.preRender());

        if (this.icos != undefined) {
            this.icos.addRotation(1, 1, 1)
            this.gShader
                .activate() //.preRender()				//add preRender to the chain
                .setCameraMatrix(this.gCamera.viewMatrix)
                .setTime(performance.now())
                .renderModal(this.icos.preRender());
        }
    }

    bind() {
        this.init = this.init.bind(this)
        this.render = this.render.bind(this)
    }
}

const _instance = new MainGL()
export default _instance


