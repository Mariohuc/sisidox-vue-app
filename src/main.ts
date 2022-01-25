import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueYouTubeEmbed from 'vue-youtube-embed';
import VueClipboard from 'vue-clipboard2';
import VuetifyConfirm from 'vuetify-confirm';
import firebase from "firebase";
import AuthStore from "./store/modules/auth";
// as a directive-only
import { VueMaskDirective } from 'v-mask';

import firebaseConfig from "./environments";
// Initialize Firebase
firebase.initializeApp(firebaseConfig[ process.env.NODE_ENV === "development" ?  "development" : "production"]);

firebase.auth().onAuthStateChanged(async (user) => {
  try {
    if(user) {
      await AuthStore.fetchUser(user);
    }else{
      AuthStore.resetState();
    }
  } catch (error: any) {
    console.error("There's problems fetching the user", error.message)
  }
    
});
 
Vue.use(VueClipboard)
Vue.use(VueYouTubeEmbed);
Vue.directive('mask', VueMaskDirective);
Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Aceptar',
  buttonFalseText: 'Cancelar'
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
