<template>
  <div class="my-2">
    <v-card v-if="mode === 'LIST'">
      <v-row class="fill-height mx-1">
        <v-col v-for="(item) in patients" :key="item.patientId" cols="12" sm="6" md="4">
          <v-card
            color="primary"
            dark
            class="d-flex flex-row align-center mx-0 my-0"
          >
            <v-text-field
              label="Paciente"
              placeholder=""
              :value="item.patientFullname"
              readonly
              hide-details
              class="mx-3 my-3"
            ></v-text-field>

            <v-btn
              color="pink"
              class="mx-3 my-3"
              @click="watchDetail(item)"
              fab
              small
              dark
            >
              <v-icon>mdi-file-account</v-icon>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <MedicalRecordDetail
      v-if="mode === 'HISTORY'"
      :key="currentPatient.patientId"
      :patientId="currentPatient.patientId"
      :patientFullname="currentPatient.patientFullname"     
      @changeMode="modeList()"
    ></MedicalRecordDetail>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MedicalRecordDetail from "./MedicalRecordDetail.vue";
import BasicReportsStore from "@/store/modules/basicReports";
import SettingsStore from "@/store/modules/settings";
import AuthStore from "@/store/modules/auth";

@Component({
  name: "MedicalRecords",
  components: {
    MedicalRecordDetail
  }
})
export default class MedicalRecords extends Vue {
  loading = false;
  mode = "";
  modes = ["LIST", "HISTORY"];
  patients: Array<any> = [];
  created(): void {
    this.modeList();
    this.loadDoctorPatients();
  }
  currentPatient: { patientId: string, patientFullname: string } = { patientId: "", patientFullname: "" }
  async loadDoctorPatients(): Promise<void> {
    const data: Array<any> = await BasicReportsStore.getDoctorPatients({ 
      page: 1,
      limit: SettingsStore.requestDataSize,
      doctorId: AuthStore.uid,
      recordStatus: "A"
     });

    if( data.length > 0 ){
      this.patients = data;
    }
  }
  watchDetail(item: { patientId: string, patientFullname: string }): void {
    this.mode = this.modes[1];
    this.currentPatient = item;
  }
  modeList(): void {
    this.mode = this.modes[0];
    this.currentPatient = { patientId: "", patientFullname: "" }
  }
  reserve() {
    this.loading = true;

    setTimeout(() => (this.loading = false), 2000);
  }
}
</script>

<style></style>
