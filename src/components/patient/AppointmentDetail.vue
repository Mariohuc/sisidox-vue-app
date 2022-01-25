<template>
  <div>
    <v-toolbar dark color="blue">
      <v-avatar color="primary" class="mr-2">
        <v-icon dark>mdi-card-account-details</v-icon>
      </v-avatar>
      <v-toolbar-title>Detalles de cita</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card flat>
      <v-card-text class="pt-4">
        <v-text-field
          label="Nombre del doctor:"
          :value="appointmentDetail.doctorFullname"
          readonly
        >
          <template v-slot:prepend>
            <v-avatar size="36">
              <img :src="appointmentDetail.doctorPhotoUrl || '/img/generic/doctor-default.png'" alt="Clock" />
            </v-avatar>
          </template>
        </v-text-field>
        
        <v-text-field
          label="Fecha y hora de cita:"
          :value="appointmentDetail.startTime"
          readonly
        >
          <template v-slot:prepend>
            <v-avatar size="36">
              <img src="/img/clock.png" alt="Clock" />
            </v-avatar>
          </template>
        </v-text-field>
        
        <v-textarea
          label="Comentarios previos a la cita"
          rows="3"
          :value="appointmentDetail.previousPatientComments || 'No hay comentarios'"
          prepend-icon="mdi-comment"
          readonly
        ></v-textarea>

        <v-textarea
          label="Conclusiones del doctor"
          rows="3"
          :value="appointmentDetail.doctorConclusions || 'No hay conclusiones'"
          prepend-icon="mdi-comment-check"
          readonly
        ></v-textarea>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import { DoctorData, SnackBarParams } from "@/store/models";

import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue";

@Component({
  name: "AppointmentDetail",
  components: {}
})
export default class AppointmentDetail extends Vue {
  @Prop() appointmentDetail!: any;

  close(): void {
    this.$emit("closeApptDetailEvent");
  }
}
</script>

<style scoped>
</style>