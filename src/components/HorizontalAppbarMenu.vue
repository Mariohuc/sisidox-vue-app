<template>
  <div>
    <v-btn v-if="checkIfisAdmin" icon to="/admin" color="gold">
      <v-icon>mdi-account-key</v-icon>
    </v-btn>
    <v-btn v-if="checkIfisDoctor" icon to="/doctor" color="indigo" @click="clickDoctor()">
      <v-icon>mdi-doctor</v-icon>
    </v-btn>
    <v-btn v-if="checkIfisPatient" icon to="/patient" color="purple">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn icon to="/">
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="n in 5" :key="n" @click="() => {}">
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Menu, Role } from "@/store/models";
import AuthStore from "@/store/modules/auth";

@Component({
  name: "HorizontalAppbarMenu"
})
export default class HorizontalAppbarMenu extends Vue {
  created(): void {
    switch (this.$router.currentRoute.path){
      case '/admin': AuthStore.SET_CURRENT_USER_MODE(Role.ADMINISTRATOR); break;
      case '/doctor': AuthStore.SET_CURRENT_USER_MODE(Role.DOCTOR); break;
      case '/patient': AuthStore.SET_CURRENT_USER_MODE(Role.PATIENT); break;
      default: AuthStore.SET_CURRENT_USER_MODE(Role.GUEST); break;
    }
  }
  
  get checkIfisDoctor() : boolean {
    return AuthStore.roles.some((item) => item === Role.DOCTOR);
  }
  get checkIfisPatient() : boolean {
    return AuthStore.roles.some((item) => item === Role.PATIENT);
  }
  get checkIfisAdmin() : boolean {
    return AuthStore.roles.some((item) => item === Role.ADMINISTRATOR);
  }
}
</script>

<style>
</style>