<template>
  <v-main style="height: 100vh">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="4">
          <v-card flat class="text-center"
            ><p class="text-h4">Bienvenido {{ displayName }}</p></v-card
          >
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";

@Component({
  name: "AdminDashboard"
})
export default class AdminDashboard extends Vue {
  
  get displayName(): string {
    return AuthStore.displayName ? AuthStore.displayName.substring(0,  AuthStore.displayName.indexOf(' ')) : "usuario"
  }
}
</script>

<style>
</style>