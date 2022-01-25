<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "App"
})
export default class App extends Vue {}
</script>

<style>
.cropper-crop-box, .cropper-view-box {
  border-radius: 50%;
}

.cropper-view-box {
  box-shadow: 0 0 0 1px #39f;
  outline: 0;
}
</style>