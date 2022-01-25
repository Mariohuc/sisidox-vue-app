<template>
  <v-card flat>
    <v-card-text class="pt-4">
      <v-stepper v-model="step" vertical>
        <v-stepper-step :complete="step > 1" step="1"> Selecciona una imagen </v-stepper-step>

        <v-stepper-content step="1">
          <v-card class="mb-4">
            <input
              ref="input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage"
            />

            <v-row justify="center">
              <v-col cols="12" md="6" class="d-flex justify-center">
                <v-btn color="primary" @click="showFileChooser">
                  Subir una foto
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2 || photoSubmitted" step="2"> Recorta la imagen </v-stepper-step>

        <v-stepper-content step="2">
          <v-card class="mb-4">
            <v-row>
              <v-col cols="12">
                <vue-cropper ref="cropper" :aspect-ratio="1 / 1" :src="imgSrc" />
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col cols="12" sm="8" md="5">
                <v-btn :loading="csiBtnLoading" color="primary" block @click="cropAndSaveImage()">Recortar y guardar</v-btn>
              </v-col>
              <v-col cols="12" sm="4" md="2">
                <v-btn v-if="!csiBtnLoading" text color="secondary" block @click="goToSelectFileStep()">Atrás</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-stepper-content>
      </v-stepper>
    </v-card-text>

    <GeneralSnackBar
      :snackbar="snackBarParams.snackbar"
      :color="snackBarParams.color"
      :text="snackBarParams.text"
      @changeStatus="updateSnackBarStatus($event)"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import { DoctorData, SnackBarParams } from "@/store/models";
import { uploadDoctorPhoto } from "./utils";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue";
import { getSnackBarErrorParams } from "@/general-utils";

interface InputFile extends Vue {
  click(): void;
}

interface VCropper extends Vue {
  replace(value: any): void;
  getCroppedCanvas(): VCroppedCanvas
}

interface VCroppedCanvas {
  toBlob(value: any): void
}

@Component({
  name: "DoctorAvatarEditor",
  components: {
    VueCropper,
    GeneralSnackBar
  }
})
export default class DoctorAvatarEditor extends Vue {
  step = 1;
  $refs!: {
    input: InputFile;
    cropper: VCropper;
  };
  imgSrc: string | ArrayBuffer | null = null;
  currentFileName = ""
  csiBtnLoading = false
  snackBarParams: SnackBarParams = {
    snackbar: false,
    color: "success",
    text: ""
  };
  photoSubmitted = false

  @Prop() doctorData!: DoctorData;

  updateSnackBarStatus(val: boolean): void {
    this.snackBarParams.snackbar = val;
  }
  @Watch("photoSubmitted")
  photoSubmittedChanged(val: boolean): void {
    if( val ){
      this.submitted()
    }
  }
  setImage(e: any): void {
    const file = e.target.files[0];
    if (file.type.indexOf("image/") === -1) {
      this.snackBarParams = {
        snackbar: true,
        color: "warning",
        text: "Por favor selecciona una imagen"
      };
      return;
    }
    if (typeof FileReader === "function") {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgSrc = event.target.result;
        // rebuild cropperjs with the updated source
        this.$refs.cropper.replace(event.target.result);
        this.step = 2;
      };
      reader.readAsDataURL(file);
      this.currentFileName = file.name
    } else {
      this.snackBarParams = {
        snackbar: true,
        color: "error",
        text: "La función FileReader no es soportada"
      };
    }
  }

  showFileChooser(): void {
    this.$refs.input.click();
  }
  goToSelectFileStep(): void {
    this.step = 1
  }
  cropAndSaveImage(): void {
    // get image data for post processing, e.g. upload or setting image src
    this.csiBtnLoading = true
    this.$refs.cropper.getCroppedCanvas().toBlob( async (blob: any) => {
      const formData = new FormData();
      formData.append("photo", blob, this.currentFileName);
      formData.append("doctorId", AuthStore.uid)
      try {
        await uploadDoctorPhoto( formData )
        this.photoSubmitted = true;
        this.snackBarParams = { snackbar: true, color: 'success', text: 'Foto de perfil guardado!' }
      } catch (error) {
        this.snackBarParams = getSnackBarErrorParams(error)
      } finally {
        this.csiBtnLoading = false
      }
    });
  }
  submitted(): void {
    this.$emit("photoSubmittedEvent");
  }
}
</script>

<style scoped>
input[type="file"] {
  display: none;
}
</style>