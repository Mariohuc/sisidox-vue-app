<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-app-bar color="#FC4210" dark app>
      <v-avatar size="40" tile class="mr-2">
        <img src="/icono-sisidox.png" alt="Sisidox" class="ma-1" />
      </v-avatar>
      <v-toolbar-title>Inicio de sesión como doctor</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main style="height: 100vh">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card flat class="text-center"
              ><v-btn
                @click="signInWithGoogleAsDoctor()"
                block
                color="primary"
                class="my-4"       
                x-large
                :disabled="!doctorCreationTicket"
              >
                <v-icon class="mr-2"> mdi-google </v-icon>
                <span style="display: block" class="text-truncate">
                  Iniciar sesión como <strong>doctor</strong></span
                >
              </v-btn></v-card
            >
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <GeneralSnackBar 
      :snackbar="snackBarParams.snackbar" 
      :color="snackBarParams.color" 
      :text="snackBarParams.text" 
      :timeout="snackBarParams.timeout"
      @changeStatus="updateSnackBarStatus($event)"/>

    <GeneralFooter color="#FC4210" />
  </v-card>
</template>

<style scoped>
.footer {
  width: 100%;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DoctorCreationTicket, Menu, Role, SnackBarParams } from "@/store/models";
import GeneralFooter from "@/components/general/GeneralFooter.vue";
import AuthStore from "@/store/modules/auth";
import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue"
import DoctorCreationTicketsStore from "@/store/modules/doctorCreationTickets"
import { getSnackBarErrorParams } from "@/general-utils";

@Component({
  name: "RegisterDoctor",
  components: {
    GeneralFooter,
    GeneralSnackBar
  }
})
export default class RegisterDoctor extends Vue {
  drawer = true;
  miniVariant = false;
  title = "Sisidox | Registro de doctor";
  doctorCreationTicket: DoctorCreationTicket | null = null

  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '', timeout: 8000 }
  
  async created(): Promise<void> {
    document.title = this.title;
    this.snackBarParams = await this.checkDCTicket(this.$route.params.dcTicketId)
  }
  async checkDCTicket( ticket: string ): Promise<SnackBarParams> {
    
    try {
      if( AuthStore.uid ){
        await AuthStore.logout()
        console.info('User logged')
      }
      this.doctorCreationTicket = await DoctorCreationTicketsStore.getById(ticket);
      console.log(this.doctorCreationTicket)
      return { snackbar: true, color: 'success', text: 'Ticket valido!', timeout: 3000 }
    } catch (error) {
      return getSnackBarErrorParams(error)
    }
  }
  async signInWithGoogleAsDoctor(): Promise<void> {
    try {
      await AuthStore.signInWithGoogle(Role.DOCTOR);
      this.$router.push({ path: '/doctor' });
      
    } catch (error: any) {
      console.error(error.message);
      this.snackBarParams = { snackbar: true, color: 'error', text: 'Error interno, por favor intentalo en otro momento' }
    } finally{
      this.removeTicket(this.$route.params.dcTicketId);
    }
    
  }
  async removeTicket( dcTicketId: string ): Promise<void> {
    await DoctorCreationTicketsStore.deleteTicket(dcTicketId);
  }
  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }
}
</script>