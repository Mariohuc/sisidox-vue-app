<template>
  <v-dialog v-model="dialog" transition="dialog-top-transition" max-width="550">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="pl-0" v-if="loggedIn" rounded outlined @click="logout">
          <v-avatar size="35" left>
            <img
              :src="photoUrl"
              alt="John"
            >
          </v-avatar>
        <span class="ml-2">Salir</span>
      </v-btn>
      <v-btn v-else rounded outlined v-bind="attrs" v-on="on"
        ><span>Iniciar sesión</span></v-btn
      >
    </template>

    <v-card>
      <h1 class="text-center pt-4 font-weight-light display-6">
        Inicia sesión
      </h1>
      <v-divider class="my-2"></v-divider>
      <v-card-text>
        <v-row class="mt-3" align="center" justify="center">
          <v-col md="10" lg="10">
            <v-btn
              rounded
              @click="signInWithGoogle"
              large
              block
              dark
              color="red"
            >
              <v-icon class="mr-2"> mdi-google </v-icon>
              <span style="display: block" class="text-truncate">
                Iniciar sesión con Google (Paciente)</span
              >
            </v-btn>
            <v-btn
              rounded
              @click="signInWithGoogleAsDoctor"
              large
              block
              dark
              color="blue"
              class="my-4"
            >
              <v-icon class="mr-2"> mdi-google </v-icon>
              <span style="display: block" class="text-truncate">
                Iniciar sesión con Google (Doctor)</span
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AuthStore from "@/store/modules/auth";
import { Role } from "@/store/models";

@Component({
  name: "Login"
})
export default class Login extends Vue {
  photoUrl: string = AuthStore.photoURL;
  dialog = false;
  get loggedIn(): boolean {
    return AuthStore.uid !== "" ? true : false;
  }
  async signInWithGoogle(): Promise<void> {
    try {
      await AuthStore.signInWithGoogle();
      this.dialog = false;
    } catch (error) {
      console.error(error.message);
    }
  }
  async signInWithGoogleAsDoctor(): Promise<void> {
    try {
      await AuthStore.signInWithGoogle(Role.DOCTOR);
      this.dialog = false;
    } catch (error) {
      console.error(error.message);
    }
  }
  async logout(): Promise<void> {
    try {
      await AuthStore.logout();
    } catch (error) {
      console.error(error.message);
    }
  }
}
</script>


<style scoped>

</style>