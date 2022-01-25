<template>
  <div>
    <v-card flat>
      <v-card-title>
        <v-avatar color="primary">
          <v-icon dark>mdi-star</v-icon>
        </v-avatar>
        <span class="headline ml-2">Añadir valoración</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4 text-center">
        <v-form ref="form" v-model="valid">
          <v-input :value="rating" :rules="[(v) => !!v && v > 0 || 'Este campo es requerido']">
            <v-rating
              class="mx-auto"
              v-model="rating"
              background-color="yellow"
              half-increments
              color="yellow accent-4"
              size="32"
              :readonly="readonly"
          ></v-rating>
          </v-input>
         
          <v-textarea
            label="Comentarios"
            rows="3"
            prepend-icon="mdi-comment"
            v-model="comment"
            :readonly="readonly"
          ></v-textarea>

          <v-btn
            :disabled="!valid"
            color="primary"
            :dark="valid"
            rounded
            block
            class="mt-3"
            :loading="btnLoading01"
            @click="createRating()"
          >
            Enviar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <GeneralSnackBar 
      :snackbar="snackBarParams.snackbar" 
      :color="snackBarParams.color" 
      :text="snackBarParams.text" 
      @changeStatus="updateSnackBarStatus($event)"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import RatingsStore from "@/store/modules/ratings";
import { SnackBarParams } from "@/store/models";

import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue";
import { getSnackBarErrorParams } from "@/general-utils";

@Component({
  name: "Rating",
  components: {
    GeneralSnackBar
  }
})
export default class Rating extends Vue {
  @Prop() ratingId!: string
  @Prop() qualifiedUserId!: string
  @Prop() whoDoesRatingId!: string
  @Prop({ default: true }) isQualifierApatient!: boolean
  @Prop() bookedAppointmentId!: string
  @Prop({ default: false }) readonly!: boolean
  rating = 0
  comment = ""
  btnLoading01 = false
  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '' }

  valid = false

  async created(): Promise<void> {
    this.checkForRatingsByAppointment(this.bookedAppointmentId)
  }
  async checkForRatingsByAppointment(bookedAppointmentId: string): Promise<void> {
    if( !bookedAppointmentId ) return;

    const respose: Array<any> = await RatingsStore.getAllRatings({ bookedAppointmentId })
    if( respose.length > 0 ){
      this.close()
    }
  }

  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }

  close(): void {
    this.$emit("closeRatingEvent");
  }
  async createRating(): Promise<void>{
    try {
      this.btnLoading01 = true;
      const respose: any = await RatingsStore.createRating({ qualifiedUserId: this.qualifiedUserId, rating: this.rating, comment: this.comment, whoDoesRatingId: this.whoDoesRatingId, isQualifierApatient: this.isQualifierApatient, bookedAppointmentId: this.bookedAppointmentId })
      console.log(respose)
      this.snackBarParams = { snackbar: true, color: 'success', text: 'Guardado!' }
      this.close();
    } catch (error) {
      this.snackBarParams = getSnackBarErrorParams(error)
    } finally {
      this.btnLoading01 = false;
    }
  }
}
</script>

<style scoped>
</style>