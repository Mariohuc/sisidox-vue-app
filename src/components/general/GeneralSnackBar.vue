<template>
  <v-snackbar v-model="mSnackbar" :timeout="timeout" :color="color" dark>
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="mSnackbar = false">
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "GeneralSnackBar"
})
export default class GeneralSnackBar extends Vue {
  @Prop({ required: true }) snackbar!: boolean;
  @Prop({ default: 8000 }) timeout!: number;
  @Prop({ required: true }) color!: string;
  @Prop({ required: true }) text!: string;

  mSnackbar = false

  @Watch("snackbar")
  snackbarChanged(val: boolean): void {
    if( this.mSnackbar !== val )
      this.mSnackbar = val
  }
  @Watch("mSnackbar")
  mSnackbarChanged(val: boolean): void {
    if( this.snackbar !== val )
      this.$emit("changeStatus", val);
  }
}
</script>
