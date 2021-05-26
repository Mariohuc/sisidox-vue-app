<template>
  <div>
    <v-app-bar shrink-on-scroll color="teal lighten-5" dense dark>
      <h2 class="d-flex my-auto">SISDOX</h2>
      <v-spacer></v-spacer>
      <v-row class="d-flex my-auto" align="center" justify="space-around">
        <v-btn depressed> Inicio </v-btn>
        <v-btn depressed color="primary"> Nosotros </v-btn>
        <v-btn depressed color="error"> ¿Cómo funciona? </v-btn>
        <v-btn depressed> Reserva tu cita </v-btn>
      </v-row>
      <v-row class="d-flex my-auto" align="center" justify="space-around">
        <v-btn depressed> Inicia sesión </v-btn>
        <v-btn depressed> Regístrate </v-btn>
      </v-row>
    </v-app-bar>
  </div>
</template>
<style scoped>
h2 {
  color: #4db6ac;
}
</style>
>
