import Camera from "./Camera";
import GLInstance from "./gl";
import CameraController from "./Camera";
import { GridAxisShader, TestShader } from "./Shader";
import Primatives from "./Primatives";
import RAF from "../../utils/RAF";

class MainGL {
    init(canvas) {
        this.bind()
        this.gGridModal;
        this.gCamera
        this.gGridShader
        this.gModal
        this.gShader

        //Main Setup
        this.gl = GLInstance(canvas)
            .fFitScreen(1, 1)
            .fClear();

        this.gCamera = new Camera(this.gl);
        this.gCamera.transform.position.set(0, 0, 10);

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
        this.gModal.addRotation(0, 1, 0);

        this.gCamera.updateViewMatrix();
        this.gl.fClear();

        this.gGridShader
            .activate()
            .setCameraMatrix(this.gCamera.viewMatrix)
            .renderModal(this.gGridModal.preRender());

        this.gShader
            .activate() //.preRender()				//add preRender to the chain
            .setCameraMatrix(this.gCamera.viewMatrix)
            .setTime(performance.now())
            .renderModal(this.gModal.preRender());
    }

    bind() {
        this.init = this.init.bind(this)
        this.render = this.render.bind(this)
    }
}

const _instance = new MainGL()
export default _instance


