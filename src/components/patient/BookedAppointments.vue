<template>
  <div class="my-2">
    <v-card>
      <v-card-text>
        <v-row justify="center">
        <v-chip class="ma-2">
          <v-avatar size="36" left class="amber accent-4"> </v-avatar>
          Programadas
        </v-chip>
        <v-chip class="ma-2">
          <v-avatar size="36" left class="green accent-4"> </v-avatar>
          En curso
        </v-chip>
        <v-chip class="ma-2">
          <v-avatar size="36" left class="red accent-4"> </v-avatar>
          Finalizadas
        </v-chip>
      </v-row>
      </v-card-text>
    </v-card>
    <v-row class="fill-height mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="doctors" :search="search">
            <template v-slot:[`item.apptStatus`]="{ item }">
              <v-avatar size="24" :color="item.color"></v-avatar>
            </template>
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
      </v-col>
      <v-col cols="12">
        <v-dialog v-model="apptDetailDialog" max-width="700" persistent>
          <AppointmentDetail :appointmentDetail="selectedAppt" @closeApptDetailEvent="apptDetailDialog = false"></AppointmentDetail>
        </v-dialog>
      </v-col>
      <v-col>
        <v-dialog v-model="ratingDialog" max-width="500" persistent>
          <Rating 
            :key="ratingData.bookedAppointmentId"
            :qualifiedUserId="ratingData.qualifiedUserId"
            :whoDoesRatingId="ratingData.whoDoesRatingId"
            :bookedAppointmentId="ratingData.bookedAppointmentId"
            @closeRatingEvent="ratingDialog = false">
          </Rating>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import BasicReportsStore from "@/store/modules/basicReports";
import AppointmentsStore from "@/store/modules/appointments";
import { AppStatus } from "@/store/models";
import { DateTime } from "luxon";
import SettingsStore from "@/store/modules/settings";
import AuthStore from "@/store/modules/auth";
import AppointmentDetail from "@/components/patient/AppointmentDetail.vue"
import Rating from "@/components/shared/Rating.vue";

@Component({
  name: "BookedAppointments",
  components: {
    AppointmentDetail,
    Rating
  }
})
export default class BookedAppointments extends Vue {
  loading = false;
  selection = 1;
  SCHEDULED_STATUS: AppStatus = AppointmentsStore.SCHEDULED_STATUS;
  ONGOING_STATUS: AppStatus = AppointmentsStore.ONGOING_STATUS;
  FINISHED_STATUS: AppStatus = AppointmentsStore.FINISHED_STATUS;
  headers: Array<any> = [
    {
      text: "Nombre de doctor",
      value: "doctorFullname"
    },
    { text: "Fecha y hora de cita", value: "startTime" },
    { text: "Última actualización", value: "lastModified" },
    { text: "Estado", value: "apptStatus", align: "center" },
    { text: "Acciones", value: "actions", align: "center", sortable: false }
  ];
  doctors: any[] = [];
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

  created(): void {
    this.getPatientAppointments();
  }
  reserve() {
    this.loading = true;

    setTimeout(() => (this.loading = false), 2000);
  }
  async getPatientAppointments(): Promise<void> {
    const docApp: any[] = await BasicReportsStore.getPatientAppointments({
      page: 1,
      limit: SettingsStore.requestDataSize,
      patientId: AuthStore.uid,
      recordStatus: "A"
    });

    this.doctors = this.formatBackendBookedAppointments(docApp);
  }

  formatBackendBookedAppointments(backendData: any[]) {
    backendData.forEach((item) => {
      item.startTime = DateTime.fromISO(item.startTime)
        .setLocale("es")
        .toFormat(`dd LLLL yyyy',' hh:mm a`);
      item.lastModified = DateTime.fromISO(
        item.updatedAt ? item.updatedAt : item.createdAt
      )
        .setLocale("es")
        .toFormat(`dd LLLL yyyy',' hh:mm a`);
      switch (item.apptStatus) {
        case this.SCHEDULED_STATUS.label:
          item.color = this.SCHEDULED_STATUS.color;
          break;
        case this.ONGOING_STATUS.label:
          item.color = this.ONGOING_STATUS.color;
          break;
        case this.FINISHED_STATUS.label:
          item.color = this.FINISHED_STATUS.color;
          break;
      }
    });
    return backendData;
  }
  showAppointment(item: any): void {
    console.log(item)
    this.selectedAppt = item;
    this.apptDetailDialog = true;
  }
  checkForAppointmentRating(item: any): boolean {
    if( item.ratings > 0 || item.apptStatus != this.FINISHED_STATUS.label ) return false;
    
    const current = DateTime.now();
    const someDate = DateTime.fromISO(item.endTime)
    
    if ( someDate.startOf("day") < current.startOf("day") ) return false;

    return true;
  }
  editRating(item: any): void {
    this.ratingDialog = true;
    this.ratingData = { qualifiedUserId: item.doctorId, whoDoesRatingId: item.patientId, bookedAppointmentId: item.id }
  }
}
</script>

<style></style>
