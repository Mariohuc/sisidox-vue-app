<template>
  <div class="my-2">
    <v-card>
      <v-card-text>
        <v-row justify="center">
        <v-chip class="ma-2">
          <v-avatar size="36" left :color="SCHEDULED_STATUS.color"> </v-avatar>
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
    <v-row class="fill-height mt-6">
      <v-col
        v-for="(item, i) in patients"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card color="purple accent-3" dark class="mx-0 my-0">
          <v-fab-transition>
            <v-btn :color="item.color" fab dark absolute top right>
              <v-icon>mdi-calendar-cursor</v-icon>
            </v-btn>
          </v-fab-transition>
          <v-card-text>
            <v-row align="center" class="mx-0 my-0">
              <v-col cols="12">
                <v-text-field
                  label="Paciente"
                  placeholder=""
                  v-model="item.patientName"
                  readonly
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Fecha"
                  placeholder=""
                  v-model="item.startTime"
                  readonly
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Ultima modificación"
                  placeholder=""
                  v-model="item.updatedAt"
                  readonly
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BasicReportsStore from "@/store/modules/basicReports";
import AuthStore from "@/store/modules/auth";
import AppointmentsStore from "@/store/modules/appointments"
import { AppStatus } from "@/store/models";
import { DateTime } from "luxon"

@Component({
  name: "ScheduledAppointments"
})
export default class ScheduledAppointments extends Vue {
  loading = false;
  selection = 1;
  SCHEDULED_STATUS: AppStatus = AppointmentsStore.SCHEDULED_STATUS;
  ONGOING_STATUS: AppStatus = AppointmentsStore.ONGOING_STATUS;
  FINISHED_STATUS: AppStatus = AppointmentsStore.FINISHED_STATUS;

  patients: any[] = [];

  created(): void {
    this.getDoctorAppointments()
  }
  reserve() {
    this.loading = true;

    setTimeout(() => (this.loading = false), 2000);
  }

  async getDoctorAppointments(): Promise<void> {
    const docApp: any[] = await BasicReportsStore.getDoctorAppointments({
      page: 1,
      limit: 500,
      doctorId: AuthStore.uid,
      recordStatus: 'A'
    })
    
    this.patients = this.formatBackendBookedAppointments(docApp);
  }

  formatBackendBookedAppointments( backendData: any [] ){
    backendData.forEach(item => {
      item.startTime = DateTime.fromISO(item.startTime).setLocale('es').toFormat(`dd LLLL yyyy',' hh:mm a`);
      item.updatedAt = DateTime.fromISO(item.updatedAt).setLocale('es').toFormat(`dd LLLL yyyy',' hh:mm a`);
      switch( item.apptStatus ){
        case this.SCHEDULED_STATUS.label: item.color = this.SCHEDULED_STATUS.color; break;
        case this.ONGOING_STATUS.label: item.color = this.ONGOING_STATUS.color; break;
        case this.FINISHED_STATUS.label: item.color = this.FINISHED_STATUS.color; break;
      }
    })
    return backendData;
  }
}
</script>

<style></style>
