<template>
  <v-card class="mt-5" flat>
    <v-card class="d-flex flex-row mx-4 mt-2" flat tile>
      <v-text-field
        :value="PatientFullname"
        label="Historial de"
        outlined
        readonly
      ></v-text-field>
    </v-card>
    <v-expansion-panels popout>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Alergias
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-chip-group column>
            <v-chip
              v-for="(item, i) in allergies"
              :key="i"
              color="amber accent-4"
              text-color="white"
            >
              <v-avatar left> <v-icon>mdi-emoticon-sick</v-icon> </v-avatar
              >{{ item.name }}</v-chip
            >
          </v-chip-group>
          <CustomAlert v-if="noAllergies" :message="'No hay información disponible'" :color="'secondary'" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Enfermedades
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-chip-group column>
            <v-chip
              v-for="(item, i) in diseases"
              :key="i"
              color="red"
              text-color="white"
            >
              <v-avatar left> <v-icon>mdi-emoticon-sick</v-icon> </v-avatar
              >{{ item.name }}</v-chip
            >
          </v-chip-group>
          <CustomAlert v-if="noDiseases" :message="'No hay información disponible'" :color="'secondary'" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Consultas previas
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table @pagination="showpag($event)" :headers="headers" :items="appointments" :search="search">
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon color="primary" @click="showAppointment(item)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
                <v-btn icon color="yellow accent-4" v-if="checkForAppointmentRating(item)" @click="editRating(item)"
                  ><v-icon>mdi-star</v-icon></v-btn
                >
              </template>
            </v-data-table>
          </v-card>
          <v-card>
            <v-dialog v-model="apptDetailDialog" max-width="700" persistent>
              <AppointmentDetail :appointmentDetail="selectedAppt" @closeApptDetailEvent="apptDetailDialog = false"></AppointmentDetail>
            </v-dialog>
          </v-card>
          <v-card>
            <v-dialog v-model="ratingDialog" max-width="500" persistent>
              <Rating 
                :key="ratingData.bookedAppointmentId"
                :qualifiedUserId="ratingData.qualifiedUserId"
                :whoDoesRatingId="ratingData.whoDoesRatingId"
                :bookedAppointmentId="ratingData.bookedAppointmentId"
                @closeRatingEvent="ratingDialog = false">
              </Rating>
            </v-dialog>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import MedicalHistoryOfpatientsStore from "@/store/modules/medicalHistoryOfpatients";
import { DateTime } from "luxon";
import BasicReportsStore from "@/store/modules/basicReports";
import SettingsStore from "@/store/modules/settings";
import BookedAppointmentsStore from "@/store/modules/bookedAppointments";
import AppointmentDetail from "@/components/patient/AppointmentDetail.vue";
import Rating from "@/components/shared/Rating.vue";
import CustomAlert from "@/components/shared/CustomAlert.vue"

@Component({
  name: "MedicalRecordDetail",
  components: {
    AppointmentDetail,
    Rating,
    CustomAlert
  }
})
export default class MedicalRecordDetail extends Vue {
  diseases: Array<any> = [];
  allergies: Array<any> = [];

  headers: Array<any> = [
    { text: "Nombre de doctor", value: "doctorFullname" },
    { text: "Fecha y hora de cita", value: "startTime" },
    { text: "Acciones", value: "actions", align: "center", sortable: false }
  ];
  appointments: Array<any> = [];
  search = "";
  selectedAppt: any = null
  apptDetailDialog = false

  ratingDialog = false
  ratingData: { qualifiedUserId: string, whoDoesRatingId: string, bookedAppointmentId: string } = { qualifiedUserId: "", whoDoesRatingId: "", bookedAppointmentId: "" }

  @Watch("ratingDialog")
  ratingDialogChange(val: boolean): void {
    if( !val ){
      this.ratingData = { qualifiedUserId: "", whoDoesRatingId: "", bookedAppointmentId: "" }
    }
  }
  
  async mounted(): Promise<void> {
    this.loadPatientAppointments();
    this.loadMedicalHistory();

  }
  async loadMedicalHistory(): Promise<void> {
    const [data]: any = await MedicalHistoryOfpatientsStore.getAllHistories({
      userId: AuthStore.uid
    });
    if(!data) return;

    if (data.allergies) {
      this.allergies = JSON.parse(data.allergies);
    }
    if (data.diseases) {
      this.diseases = JSON.parse(data.diseases);
    }
  }

  removeDisease(index: number): void {
    this.diseases.splice(index, 1);
  }
  removeAllergy(index: number): void {
    this.allergies.splice(index, 1);
  }

  get PatientFullname(): string {
    return AuthStore.displayName;
  }

  async loadPatientAppointments(): Promise<void> {
    const appointments: any[] = await BasicReportsStore.getPatientAppointments({
      page: 1,
      limit: SettingsStore.requestDataSize,
      patientId: AuthStore.uid,
      apptStatus: BookedAppointmentsStore.FINISHED_STATUS.label,
      recordStatus: "A"
    });

    this.appointments = this.formatBackendBookedAppointments(appointments);
  }

  formatBackendBookedAppointments(backendData: any[]) {
    backendData.forEach((item) => {
      item.startTime = DateTime.fromISO(item.startTime)
        .setLocale("es")
        .toFormat(`dd LLLL yyyy',' hh:mm a`);
    });
    return backendData;
  }

  showAppointment(item: any): void {
    console.log(item)
    this.selectedAppt = item;
    this.apptDetailDialog = true;
  }
  showpag(item: any): void {
    console.log(item)
  }
  checkForAppointmentRating(item: any): boolean {
    if( item.ratings > 0 ) return false;
    
    const current = DateTime.now();
    const someDate = DateTime.fromISO(item.endTime)
    
    if ( someDate.startOf("day") < current.startOf("day") ) return false;

    return true;
  }
  editRating(item: any): void {
    this.ratingDialog = true;
    this.ratingData = { qualifiedUserId: item.doctorId, whoDoesRatingId: item.patientId, bookedAppointmentId: item.id }
  }
  get noAllergies(): boolean {
    return this.allergies.length < 1;
  }

  get noDiseases(): boolean {
    return this.diseases.length < 1;
  }
}
</script>

<style></style>
