<template>
  <section class="pb-8" id="contact">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row justify="center">
            <v-col cols="12" md="5">
              <h1 class="font-weight-light display-1">Contactenos</h1>
              
              <h4 class="font-weight-light mt-3">
                Teléfono: +51 964 810 483
              </h4>
              <h4 class="font-weight-light">Email: sisidox.sac@gmail.com</h4>
              
            </v-col>
            <v-col cols="12" md="7">
              <v-divider class="my-6"></v-divider>
              <div>
                <div class="footer-links">
                  <h4>Enlaces útiles</h4>
                  <ul>
                    <li><span class="mdi mdi-chevron-right"></span> <a href="#">Acerca de nosotros</a></li>
                    <li><span class="mdi mdi-chevron-right"></span> <a href="#">Términos y condiciones</a></li>
                    <li><span class="mdi mdi-chevron-right"></span> <a href="#">Politicas de privacidad</a></li>
                  </ul>
                </div>
                
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div class="svg-border-waves text-white">
      <v-img src="~@/assets/img/borderWavesBlue.svg" />
    </div>
    <v-snackbar
      v-model="snackbar.enabled"
      timeout="3000"
      right
      top
      :color="snackbar.color"
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.enabled = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<style scoped>
.footer-links h4 {
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  position: relative;
  padding-bottom: 12px;
}

.footer-links {
  margin-bottom: 30px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links ul i {
  padding-right: 2px;
  color: #1c84e3;
  font-size: 18px;
  line-height: 1;
}

.footer-links ul li {
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.footer-links ul li:first-child {
  padding-top: 0;
}

.footer-links ul a {
  color: #777777;
  transition: 0.3s;
  display: inline-block;
  line-height: 1;
}

.footer-links ul a:hover {
  text-decoration: none;
  color: #5bc8ac;
}

#contact {
  background-color: #f4f7f5;
}

.svg-border-waves .v-image {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3rem;
  width: 100%;
  overflow: hidden;
}
</style>

<script lang="ts">
// import {db} from '@/main'
import { Component, Vue } from "vue-property-decorator";
import GlobalsStore from "@/store/modules/globals";

@Component({
  name: "ContactSection",
})
export default class ContactSection extends Vue {
  icons = ["fa-facebook", "fa-twitter", "fa-linkedin", "fa-instagram"];
  
  name = "";
  nameRules = [
    (v: any) => !!v || "El nombre es requerido",
    (v: any) =>
      (v && v.length >= 6) || "El nombre debe tener más de 6 caracteres",
  ];
  email = "";
  emailRules = [
    (v: any) => !!v || "El email es requerido",
    (v: any) => /.+@.+\..+/.test(v) || "El email debe ser válido",
  ];
  textArea = "";
  textAreaRules = [
    (v: any) => !!v || "El mensaje es requerido",
    (v: any) => (v && v.length >= 10) || "Mínimo de 10 caracteres",
  ];
  
  snackbar = {
    enabled: false,
    text: "",
    color: "",
  };
  links = ['Términos y condiciones','Politicas de privacidad']
  isXs = false;

  onResize(): void {
    this.isXs = GlobalsStore.NativeWindow.innerWidth < 850;
  }

  mounted(): void {
    this.onResize();
    GlobalsStore.NativeWindow.addEventListener("resize", this.onResize, { passive: true });
  }
}
</script>
