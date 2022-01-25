<template>
  <v-card class="mt-5" flat>
    <v-card class="d-flex flex-row mx-4 mt-2" flat tile>
      <v-text-field
        :value="patientFullname"
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
          <v-form v-model="allergiesForm" ref="allergiesForm">
            <v-row>
              <v-col cols="12" sm="8" md="6" lg="5">
                <v-card class="d-flex flex-row" flat tile>              
                    <v-text-field
                      v-model="allergyName"
                      label="Nueva alergia"
                      outlined                 
                      dense
                      :rules="[(v) => !!v || 'Este campo es requerido']"
                    ></v-text-field>
                    <v-btn :disabled="!allergiesForm" @click="addAllergy(allergyName)" class="ml-4" color="primary">
                      <v-icon dark class="mr-1"> mdi-plus-circle </v-icon>
                      Añadir
                    </v-btn>                        
                </v-card>
              </v-col>
            </v-row>
          </v-form>
          
          <v-chip-group column>
            <v-chip v-for="(item, i) in allergies" :key="i" color="amber accent-4" text-color="white" close @click:close="removeAllergy(i)">
              <v-avatar left> <v-icon>mdi-emoticon-sick</v-icon> </v-avatar
              >{{ item.name }}</v-chip
            >
          </v-chip-group>
          <v-row v-if="allergiesModified" justify="center" class="mt-4">
            <v-col cols="12" sm="4" md="3">
              <v-btn class="ml-4" color="success" @click="saveAllergies()">
                <v-icon dark class="mr-1"> mdi-content-save </v-icon>
                Guardar
              </v-btn>
            </v-col>
          </v-row>
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
          <v-form v-model="diseasesForm" ref="diseasesForm">
            <v-row>
              <v-col cols="12" sm="8" md="6" lg="5">
                <v-card class="d-flex flex-row" flat tile>
                  <v-text-field
                    v-model="diseaseName"
                    label="Nueva enfermedad"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'Este campo es requerido']"
                  ></v-text-field>
                  <v-btn :disabled="!diseasesForm" @click="addDisease(diseaseName)" class="ml-4" color="primary">
                    <v-icon dark class="mr-1"> mdi-plus-circle </v-icon>
                    Añadir
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
          
          <v-chip-group column>
            <v-chip v-for="(item, i) in diseases" :key="i" color="red" text-color="white" close @click:close="removeDisease(i)">
              <v-avatar left> <v-icon>mdi-emoticon-sick</v-icon> </v-avatar
              >{{ item.name }}</v-chip
            >
          </v-chip-group>

          <v-row v-if="diseasesModified" justify="center" class="mt-4">
            <v-col cols="12" sm="4" md="3">
              <v-btn class="ml-4" color="success" @click="saveDiseases()">
                <v-icon dark class="mr-1"> mdi-content-save </v-icon>
                Guardar
              </v-btn>
            </v-col>
          </v-row>
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
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table @pagination="showpag($event)" :headers="headers" :items="appointments" :search="search">
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon color="primary" @click="showAppointment(item)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
              </template>
            </v-data-table>
          </v-card>
          <v-card>
            <v-dialog v-model="apptDetailDialog" max-width="700" persistent>
              <AppointmentDetail :appointmentDetail="selectedAppt" @closeApptDetailEvent="apptDetailDialog = false"></AppointmentDetail>
            </v-dialog>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="d-flex flex-row-reverse mx-4 my-4" flat tile>
      <v-btn @click="backToList()" color="secondary">
        <v-icon dark class="mr-1"> mdi-arrow-left-circle </v-icon> Atrás
      </v-btn>
    </v-card>

    <GeneralSnackBar 
      :snackbar="snackBarParams.snackbar" 
      :color="snackBarParams.color" 
      :text="snackBarParams.text" 
      :timeout="snackBarParams.timeout"
      @changeStatus="updateSnackBarStatus($event)"/>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue";
import MedicalHistoryOfpatientsStore from "@/store/modules/medicalHistoryOfpatients";
import { SnackBarParams } from "@/store/models";
import { getSnackBarErrorParams } from "@/general-utils";
import AuthStore from "@/store/modules/auth";
import BasicReportsStore from "@/store/modules/basicReports";
import SettingsStore from "@/store/modules/settings";
import BookedAppointmentsStore from "@/store/modules/bookedAppointments";
import AppointmentDetail from "@/components/patient/AppointmentDetail.vue";
import { DateTime } from "luxon";

@Component({
  name: "MedicalRecordDetail",
  components: {
    GeneralSnackBar,
    AppointmentDetail
  }
})
export default class MedicalRecordDetail extends Vue {
  @Prop() patientId!: string
  @Prop() patientFullname!: string
  diseases: Array<any> = [];
  diseasesModified = false
  diseasesForm = false
  diseaseName = ''
  
  allergies: Array<any> = [];
  allergiesModified = false
  allergiesForm = false
  allergyName = ''

  noMedicalHistory = false

  headers: Array<any> = [
    { text: "Nombre de doctor", value: "doctorFullname" },
    { text: "Fecha y hora de cita", value: "startTime" },
    { text: "Acciones", value: "actions", align: "center", sortable: false }
  ];
  appointments: Array<any> = [];
  search = "";
  selectedAppt: any = null
  apptDetailDialog = false

  $refs!: {
    allergiesForm: any,
    diseasesForm: any
  };

  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '', timeout: 8000 }

  @Watch('allergiesModified')
  allergiesModifiedChange(val: boolean): void {
    if( !val){
      this.$refs.allergiesForm.reset()
    }
  }
  @Watch('diseasesModified')
  diseasesModifiedChange(val: boolean): void {
    if( !val){
      this.$refs.diseasesForm.reset()
    }
  }
  mounted(): void {
    this.loadPatientAppointments();
    this.loadMedicalHistory()
  }
  async loadMedicalHistory(): Promise<void> {
    const [data]: any = await MedicalHistoryOfpatientsStore.getAllHistories({
      userId: this.patientId
    });
    if( !data ) { 
      this.noMedicalHistory = true; return;
    }
    if (data.allergies) {
      this.allergies = JSON.parse(data.allergies);
    }
    if (data.diseases) {
      this.diseases = JSON.parse(data.diseases);
    }
  }

  addAllergy(allergyName: string): void {
    this.allergies.push({ name: allergyName });
    this.$refs.allergiesForm.reset()
    this.allergiesModified = true;
  }
  async saveAllergies(): Promise<void> {
    const res: any = await this.$confirm('¿Realmente quiere guardar los cambios?', { title: 'Confirmación' })
    if (res) {
      if( this.noMedicalHistory ){
        this.snackBarParams = await this.createHistory({ userId: this.patientId, allergies: this.allergies, recordStatus: 'A' }, { allergiesModified: true });
      }else{
        this.snackBarParams = await this.updateHistory({ userId: this.patientId, payload: { allergies: this.allergies }}, { allergiesModified: true });
      }
    }
  }
  async createHistory(payload: { userId: string,
    allergies?: Array<{name: string}>,
    diseases?: Array<{name: string}>,
    recordStatus?: string }, configs?: { allergiesModified?: boolean, diseasesModified?: boolean }): Promise<SnackBarParams> {
    try {
      await MedicalHistoryOfpatientsStore.createHistory(payload);
      if( this.noMedicalHistory ) this.noMedicalHistory = false;
      if( configs?.allergiesModified ) this.allergiesModified = false;
      if( configs?.diseasesModified ) this.diseasesModified = false;
      return { snackbar: true, color: 'success', text: 'Creado!', timeout: 2000 }
    } catch (error) {
      return getSnackBarErrorParams(error)
    }
  }

  async updateHistory(allData: { userId: string, payload: {
    allergies?: Array<{name: string}>,
    diseases?: Array<{name: string}>,
    recordStatus?: string
  }}, configs?: { allergiesModified?: boolean, diseasesModified?: boolean }): Promise<SnackBarParams> {
    try {
      await MedicalHistoryOfpatientsStore.updateHistory(allData);
      if( configs?.allergiesModified ) this.allergiesModified = false;
      if( configs?.diseasesModified ) this.diseasesModified = false;
      return { snackbar: true, color: 'success', text: 'Actualizado!', timeout: 2000 }
    } catch (error) {
      console.log(error)
      return getSnackBarErrorParams(error)
    }
  }

  addDisease(diseaseName: string): void {
    this.diseases.push({ name: diseaseName });
    this.$refs.diseasesForm.reset()
    this.diseasesModified = true;
  }
  async saveDiseases() : Promise<void> {
    const res: any = await this.$confirm('¿Realmente quiere guardar los cambios?', { title: 'Confirmación' })
    if (res) {
      if( this.noMedicalHistory ){
        this.snackBarParams = await this.createHistory({ userId: this.patientId, diseases: this.diseases, recordStatus: 'A' }, { diseasesModified: true });
      }else{
        this.snackBarParams = await this.updateHistory({ userId: this.patientId, payload: { diseases: this.diseases }}, { diseasesModified: true });
      }
    }
  }
  backToList(): void {
    this.$emit("changeMode");
  }
  removeDisease(index: number): void{
    this.diseases.splice(index, 1)
    this.diseasesModified = true
  }
  removeAllergy(index: number): void{
    this.allergies.splice(index, 1)
    this.allergiesModified = true;
  }

  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }

  showAppointment(item: any): void {
    console.log(item)
    this.selectedAppt = item;
    this.apptDetailDialog = true;
  }
  showpag(item: any): void {
    console.log(item)
  }

  async loadPatientAppointments(): Promise<void> {
    const appointments: any[] = await BasicReportsStore.getPatientAppointments({
      page: 1,
      limit: SettingsStore.requestDataSize,
      patientId: this.patientId,
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
}
</script>

<style></style>
