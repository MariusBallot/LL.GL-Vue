<template>
  <div class="webGLCanvas">
    <canvas ref="glCanvas"></canvas>
  </div>
</template>

<script>
import MainGL from "../classes/GL/MainGL";

export default {
  name: "WebGLCanvas",
  mounted() {
    MainGL.init(this.$refs.glCanvas);
  }
};
</script>

<style scoped lang="stylus"></style>
