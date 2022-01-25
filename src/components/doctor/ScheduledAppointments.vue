<template>
  <div class="my-2">
    <v-card>
      <v-card-text>
        <v-row justify="center">
          <v-chip class="ma-2">
            <v-avatar size="36" left :color="SCHEDULED_STATUS.color">
            </v-avatar>
            Programadas
          </v-chip>
          <v-chip class="ma-2">
            <v-avatar size="36" left :color="ONGOING_STATUS.color"> </v-avatar>
            En curso
          </v-chip>
          <v-chip class="ma-2">
            <v-avatar size="36" left :color="FINISHED_STATUS.color"> </v-avatar>
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
          <v-data-table :headers="headers" :items="patients" :search="search">
            <template v-slot:[`item.apptStatus`]="{ item }">
              <v-avatar size="24" :color="item.color"></v-avatar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon color="primary" @click="showAppointment(item)"
                ><v-icon>mdi-eye</v-icon></v-btn
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
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BasicReportsStore from "@/store/modules/basicReports";
import AuthStore from "@/store/modules/auth";
import AppointmentsStore from "@/store/modules/appointments";
import { AppStatus } from "@/store/models";
import { DateTime } from "luxon";
import SettingsStore from "@/store/modules/settings";
import AppointmentDetail from "@/components/doctor/AppointmentDetail.vue"

@Component({
  name: "ScheduledAppointments",
  components: {
    AppointmentDetail
  }
})
export default class ScheduledAppointments extends Vue {
  loading = false;
  selection = 1;
  SCHEDULED_STATUS: AppStatus = AppointmentsStore.SCHEDULED_STATUS;
  ONGOING_STATUS: AppStatus = AppointmentsStore.ONGOING_STATUS;
  FINISHED_STATUS: AppStatus = AppointmentsStore.FINISHED_STATUS;
  headers: Array<any> = [
    {
      text: "Nombre de paciente",
      value: "patientName"
    },
    { text: "Fecha y hora de cita", value: "startTime" },
    { text: "Última actualización", value: "lastModified" },
    { text: "Estado", value: "apptStatus", align: "center" },
    { text: "Acciones", value: "actions", align: "center", sortable: false }
  ];
  patients: any[] = [];
  search = "";
  selectedAppt: any = null
  apptDetailDialog = false
  created(): void {
    this.getDoctorAppointments();
  }
  reserve() {
    this.loading = true;

    setTimeout(() => (this.loading = false), 2000);
  }

  async getDoctorAppointments(): Promise<void> {
    const docApp: any[] = await BasicReportsStore.getDoctorAppointments({
      page: 1,
      limit: SettingsStore.requestDataSize,
      doctorId: AuthStore.uid,
      recordStatus: "A"
    });

    this.patients = this.formatBackendBookedAppointments(docApp);
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
}
</script>

<style></style>
