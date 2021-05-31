<template>
  <v-app>
    <px-header />
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import PxHeader from "@/views/PxHeader.vue";

export default Vue.extend({
  name: "App",
  components: { PxHeader },
  data: () => ({
    //
  }),
});
</script>
