<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-app-bar color="pink darken-3" dark app>
      <v-avatar size="40" tile class="mr-2">
        <img src="/icono-sisidox.png" alt="Sisidox" class="ma-1" />
      </v-avatar>
      <v-toolbar-title>Inicio de sesión como administrador</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main style="height: 100vh">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card flat class="text-center"
              ><v-btn
                @click="signInWithGoogleAsAdmin()"
                block
                color="accent"
                class="my-4"       
                x-large
                :disabled="!acTicketFlag"
              >
                <v-icon class="mr-2"> mdi-google </v-icon>
                <span style="display: block" class="text-truncate">
                  Iniciar sesión como <strong>administrador</strong></span
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

    <GeneralFooter color="pink darken-3" />
  </v-card>
</template>

<style scoped>
.footer {
  width: 100%;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Menu, Role, SnackBarParams } from "@/store/models";
import GeneralFooter from "@/components/general/GeneralFooter.vue";
import AuthStore from "@/store/modules/auth";
import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue"
import { getSnackBarErrorParams } from "@/general-utils";

@Component({
  name: "RegisterAdmin",
  components: {
    GeneralFooter,
    GeneralSnackBar
  }
})
export default class RegisterAdmin extends Vue {
  drawer = true;
  miniVariant = false;
  title = "Sisidox | Registro de doctor";

  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '', timeout: 8000 }
  acTicketFlag = false;
  async created(): Promise<void> {
    document.title = this.title;
    this.snackBarParams = await this.checkACTicket(this.$route.params.acTicketId)
  }
  async checkACTicket( acTicketId: string ): Promise<SnackBarParams> {
    try {
      if( AuthStore.uid ){
        await AuthStore.logout()
        console.info('User logged')
      }
      if( acTicketId !== process.env.VUE_APP_ACTICKETID ){
        setTimeout(() => this.$router.push({ path: '/' }), 1500)
        return { snackbar: true, color: 'error', text: 'Ticket invalido!', timeout: 3000 }
      }
      this.acTicketFlag = true;
      return { snackbar: true, color: 'success', text: 'Ticket valido!', timeout: 3000 }
    } catch (error) {
      return getSnackBarErrorParams(error)
    }
  }
  async signInWithGoogleAsAdmin(): Promise<void> {
    try {
      await AuthStore.signInWithGoogle(Role.ADMINISTRATOR);
      this.$router.push({ path: '/admin' });
      
    } catch (error: any) {
      console.error(error.message);
      this.snackBarParams = { snackbar: true, color: 'error', text: 'Error interno, por favor intentalo en otro momento' }
    }
  }
  
  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }
}
</script>