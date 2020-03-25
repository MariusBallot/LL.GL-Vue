<template>
  <div id="app">
    <WebGLCanvas />
  </div>
</template>

<script>
import WebGLCanvas from "./components/WebGLCanvas.vue";

export default {
  name: "App",
  components: {
    WebGLCanvas
  }
};
</script>

<style lang="stylus">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
