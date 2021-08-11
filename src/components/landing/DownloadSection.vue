<template>
  <section id="download">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="center">
            <v-col sm="4" class="hidden-xs-only">
              <v-img
                src="@/assets/img/ill2.svg"
                class="d-block ml-auto mr-auto"
                max-width="350px"
              />
            </v-col>
            <v-col cols="12" sm="8" class="white--text text-left">
              <h1 class="font-weight-light display-2 mb-2">¿Cómo funciona?</h1>
              <h1 class="font-weight-light">
                Visualiza nuestras guias de usuarios disponibles en Youtube
              </h1>
              <div class="d-flex flex-column flex-md-row">
                <v-btn
                  rounded
                  outlined
                  href="https://github.com/Joabsonlg/Landing-Page"
                  target="_blank"
                  large
                  color="white"
                  class="mt-4 mr-0 mr-md-4"
                >
                  <v-icon class="mr-2"> mdi-doctor </v-icon>
                  Guía para médicos
                </v-btn>
                <v-btn
                  rounded
                  outlined
                  href="https://github.com/Joabsonlg/Landing-Page"
                  target="_blank"
                  large
                  color="white"
                  class="mt-4"
                >
                  <v-icon class="mr-2"> mdi-account </v-icon>
                  Guía para pacientes
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
#download {
  background-image: url("~@/assets/img/bgDownload.jpg");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 500px;
}

#download .container,
#download .row {
  height: 100%;
}
</style>