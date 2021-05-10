<template>
  <v-dialog v-model="dialog" transition="dialog-top-transition" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="loggedIn" color="primary" @click="logout">Salir</v-btn>
      <v-btn v-else color="primary" v-bind="attrs" v-on="on"
        >Iniciar sesión</v-btn
      >
    </template>

    <v-card>
      <v-card-title class="mb-6">
        <span class="headline mx-auto">Inicia sesión</span>
      </v-card-title>
      <v-card-text>
        <div>
          <div class="d-flex align-content-center">
            <v-btn color="red" dark class="mx-auto" @click="signInWithGoogle">
              <v-icon class="mr-2">mdi-google</v-icon>Iniciar sesión con Google
            </v-btn>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn icon outlined class="mb-3" @click="dialog = false">
          <v-icon dark> mdi-close </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AuthStore from "@/store/modules/auth";

@Component({
  name: "Login"
})
export default class Login extends Vue {
  dialog = false;
  get loggedIn():boolean {
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
  async logout(): Promise<void> {
    try {
      await AuthStore.logout();
    } catch (error) {
      console.error(error.message);
    }
  }
}
</script>
