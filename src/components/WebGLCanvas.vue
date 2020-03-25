<template>
  <div class="webGLCanvas">
    <canvas ref="glCanvas"></canvas>
  </div>
</template>

<script>
import Camera from "../classes/GL/Camera";
import GLInstance from "../classes/GL/gl";
import CameraController from "../classes/GL/Camera";
import { GridAxisShader, TestShader } from "../classes/GL/Shader";
import Primatives from "../classes/GL/Primatives";
import RAF from "../utils/RAF";

import * as glMatrix from "gl-matrix";

export default {
  name: "WebGLCanvas",
  mounted() {
    var gl, gRLoop, gShader, gModal, gCamera, gCameraCtrl;
    var gGridShader, gGridModal;
    var gModal2;

    //Main Setup
    gl = GLInstance(this.$refs.glCanvas)
      .fFitScreen(0.65, 0.6)
      .fClear();

    gCamera = new Camera(gl);
    // gCamera.transform.position.set(0, 1, 3);
    console.log(gCamera.transform.position);
    glMatrix.vec3.set(gCamera.transform.position, 0, 1, 3);
    console.log(gCamera.transform.position);

    gCameraCtrl = new CameraController(gl, gCamera);

    //....................................
    //Load up resources
    //gl.fLoadTexture("tex001",document.getElementById("imgTex"));

    //....................................
    //Setup Grid
    console.log(GridAxisShader);
    gGridShader = new GridAxisShader(gl, gCamera.projectionMatrix);
    gGridModal = Primatives.GridAxis.createModal(gl, false);

    //....................................
    //Setup Test Shader, Modal, Meshes
    gShader = new TestShader(gl, gCamera.projectionMatrix);
    //.setTexture(gl.mTextureCache["tex001"]);

    gModal = Primatives.Cube.createModal(gl);
    gModal.setPosition(0, 0.6, 0);

    //....................................
    //Start Rendering
    RAF.subscribe("glRenderLoop", onRender);
    //onRender(0);

    function onRender(dt) {
      gCamera.updateViewMatrix();
      gl.fClear();

      gGridShader
        .activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gGridModal.preRender());

      gShader
        .activate() //.preRender()				//add preRender to the chain
        .setCameraMatrix(gCamera.viewMatrix)
        .setTime(performance.now())
        .renderModal(gModal.preRender());
    }
  }
};
</script>

<style scoped lang="stylus"></style>
