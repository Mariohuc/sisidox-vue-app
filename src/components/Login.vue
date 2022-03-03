<template>
  <v-dialog v-model="dialog" transition="dialog-top-transition" max-width="550">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="pl-0" v-if="loggedIn && showLogout" rounded :block="vertical" outlined @click="logout" :loading="loginBtnLoading">
          <v-avatar v-if="!vertical" size="35" left>
            <img
              :src="photoUrl"
              alt="John"
            >
          </v-avatar>
        <span class="ml-2">Salir</span>
      </v-btn>
      <v-btn v-if="!loggedIn" rounded :block="vertical" outlined v-bind="attrs" v-on="on" :loading="loginBtnLoading"
        ><span>{{ btnCustomText }}</span></v-btn
      >
    </template>

    <v-card>
      <h1 class="text-center pt-4 font-weight-light display-6">
        Inicia sesión
      </h1>
      
      <v-card-text>
        <v-row class="mt-3" align="center" justify="center">
          <v-col md="10" lg="10">

            <v-btn
              @click="signInWithGoogle"
              large
              block
              color="error"
            >
              <v-icon class="mr-2"> mdi-google </v-icon>
              <span style="display: block" class="text-truncate">
                Iniciar sesión con Google</span
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
import { Prop } from "vue-property-decorator";

@Component({
  name: "Login"
})
export default class Login extends Vue {
  @Prop({ default: false }) vertical!: boolean;
  @Prop({ default: 'Iniciar sesión' }) btnCustomText!: string;
  @Prop({ default: true }) showLogout!: boolean;
  dialog = false;
  get loggedIn(): boolean {
    return AuthStore.uid !== "" ? true : false;
  }
  get photoUrl(): string {
    return AuthStore.photoURL;
  }
  get loginBtnLoading(): boolean {
    return AuthStore.fetchUserLoading;
  }
  async signInWithGoogle(): Promise<void> {
    try {
      await AuthStore.signInWithGoogle();
      this.dialog = false;
      this.$emit("successfulLoginEvent", true);
    } catch (error: any) {
      console.error(error.message);
      this.$emit("successfulLoginEvent", false);
    }
  }
  
  async logout(): Promise<void> {
    try {
      await AuthStore.logout();
    } catch (error: any) {
      console.error(error.message);
    }
  }
}
</script>


<style scoped>

</style>