<template>
  <v-card :color="color" dark flat>
    <v-card-text class="text-center">
      {{ message }}
    </v-card-text>         
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "CustomAlert"
})
export default class CustomAlert extends Vue {
  @Prop({ default: '' }) message!: string
  @Prop({ default: 'primary' }) color!: string
}
</script>

<style>

</style>