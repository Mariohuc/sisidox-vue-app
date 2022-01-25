<template>
  <v-footer class="g-footer" :color="color" app fixed dark padless>
    <v-container class="d-flex flex-row my-2">
      <v-card color="transparent" flat tile class="white--text">
        <strong>{{ new Date().getFullYear() }} © Sisidox.</strong>
      </v-card>

    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "GeneralFooter"
})
export default class GeneralFooter extends Vue {
  @Prop({default: 'blue'}) color!: string
}
</script>

<style scoped>
.g-footer {
  font-family: "Poppins", sans-serif;
  font-size: 13px;
}
</style>
