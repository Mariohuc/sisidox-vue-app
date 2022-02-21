<template>
  <v-main>
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card>
            <v-toolbar dark color="blue">
              <v-icon class="mr-2">mdi-contacts</v-icon>
              <v-toolbar-title>Accesos para nuevos doctores</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="mt-6">
              <v-form v-model="doctorAccessCreationForm" ref="form">
                <v-row justify="center">
                  <v-col cols="12" sm="5" md="4" class="py-0">
                    <v-select
                      :items="documentTypes"
                      :rules="[(v) => !!v || 'Este campo es requerido']"
                      label="Tipo de documento"
                      outlined
                      v-model="doctorAccessCreationData.documentType"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="5" md="4" class="py-0">
                    <v-text-field
                      value=""
                      :rules="[(v) => !!v || 'Este campo es requerido', (v) => v.length <= 25 || 'El tamaño maximo es de 25']"
                      label="Número documento"
                      outlined
                      counter="25"
                      v-model="doctorAccessCreationData.documentNumber"
                    >
                    </v-text-field>
                  </v-col>              
                </v-row>
              </v-form>
              <v-row justify="center">
                <v-col cols="12" sm="3" md="2" class="mb-4">
                  <v-btn :loading="doctorCreationTicketCreationLoading" text block color="primary" @click="createDoctorCreationTicket()" :disabled="!doctorAccessCreationForm"> Crear acceso </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row justify="center" class="mt-3">
                <v-col cols="12" sm="10" md="8">
                  <v-text-field
                    :value="dACurlPath"
                    label="Enlace generado"
                    outlined
                    readonly
                    append-icon="mdi-content-copy"
                    @click:append="copyDACurl"
                    hide-details
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>

      <GeneralSnackBar 
        :snackbar="snackBarParams.snackbar" 
        :color="snackBarParams.color" 
        :text="snackBarParams.text" 
        :timeout="snackBarParams.timeout"
        @changeStatus="updateSnackBarStatus($event)"/>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DoctorCreationTicketsStore from "@/store/modules/doctorCreationTickets"
import { SnackBarParams } from "@/store/models";
import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue";
import { getSnackBarErrorParams } from "@/general-utils"
import GlobalsStore from "@/store/modules/globals";

@Component({
  name: "AccessCreation",
  components: {
    GeneralSnackBar
  }
})
export default class AccessCreation extends Vue {
  doctorAccessCreationForm = false;
  documentTypes: string[] = ["DNI", "PASAPORTE", "RUC"];
  doctorAccessCreationData: any = {
    documentType: "",
    documentNumber: ""
  }
  currentDcTicketId = "";
  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '', timeout: 8000 }
  doctorCreationTicketCreationLoading = false
  
  async createDoctorCreationTicket(): Promise<void> {
    this.snackBarParams = await this.createDCTicket()
  }

  async createDCTicket(): Promise<SnackBarParams> {
    this.currentDcTicketId = ""
    this.doctorCreationTicketCreationLoading = true;
    try {
      const result: { dcTicketId: string } = await DoctorCreationTicketsStore.createTicket(this.doctorAccessCreationData)
      this.currentDcTicketId = result.dcTicketId;
      return { snackbar: true, color: 'success', text: 'El ticket fue creado con exito!', timeout: 4000 }
    } catch (error) {
      return getSnackBarErrorParams(error)
    } finally {
      this.doctorCreationTicketCreationLoading = false
    }
    
  }

  copyDACurl(): void {
    this.$copyText(this.dACurlPath).then( (e) => {
      this.snackBarParams = { snackbar: true, color: 'success', text: 'Copiado!', timeout: 2000 }
    }, (e) => {
      this.snackBarParams = { snackbar: true, color: 'error', text: 'No se pudo copiar!', timeout: 2500 }
      console.log(e)
    })
  }
  get dACurlPath(): string {
    if( !this.currentDcTicketId ) return "Aqui se mostrará el enlace";
    return GlobalsStore.NativeWindow.location.href.substring(0, GlobalsStore.NativeWindow.location.href.lastIndexOf('/#/')+3) + 'register-doctor/' + this.currentDcTicketId
  }

  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }
}
</script>

<style>
</style>