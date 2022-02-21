<template>
  <div>
    <navigation :color="color" :flat="flat" />
    <v-main class="pt-0">
      <home />
      <about />
      <download />
      <pricing />
      <contact />
    </v-main>
    <v-scale-transition>
      <v-btn
        fab
        v-show="fab"
        v-scroll="onScroll"
        dark
        fixed
        bottom
        right
        color="secondary"
        @click="toTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-scale-transition>
    <foote />
  </div>
</template>

<style scoped>
.v-main {
  background-image: url("~@/assets/img/bgMain.png");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import navigation from "@/components/landing/Navigation.vue";
import foote from "@/components/landing/Footer.vue";
import home from "@/components/landing/HomeSection.vue";
import about from "@/components/landing/AboutSection.vue";
import download from "@/components/landing/DownloadSection.vue";
import pricing from "@/components/landing/PricingSection.vue";
import contact from "@/components/landing/ContactSection.vue";
import GlobalsStore from "@/store/modules/globals";

@Component({
  name: "Home",
  components: {
    navigation,
    foote,
    home,
    about,
    download,
    pricing,
    contact
  }
})
export default class Home extends Vue {
  fab = false;
  color = "";
  flat = false;

  created(): void {
    const top = GlobalsStore.NativeWindow.pageYOffset || 0;
    if (top <= 60) {
      this.color = "blue lighten-2";
      this.flat = true;
    }
  }

  @Watch("fab")
  fabChange(value: any): void {
    if (value) {
      this.color = "secondary";
      this.flat = false;
    } else {
      this.color = "blue lighten-2";
      this.flat = false;
    }
  }

  onScroll(e: any): void {
    if (typeof GlobalsStore.NativeWindow === "undefined") return;
    const top = GlobalsStore.NativeWindow.pageYOffset || e.target.scrollTop || 0;
    this.fab = top > 60;
  }
  toTop(): void {
    this.$vuetify.goTo(0);
  }
}
</script>
