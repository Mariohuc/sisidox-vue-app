import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import firebase from "firebase";
import AuthStore from "./store/modules/auth";
import AppointmentsStore from "./store/modules/appointments";
import firebaseConfig from "./environments"
// Initialize Firebase
firebase.initializeApp(firebaseConfig[ process.env.NODE_ENV === "development" ?  "development" : "production"]);

firebase.auth().onAuthStateChanged(async (user) => {
  try {
    if(user) {
      await AuthStore.fetchUser(user);
    }else{
      AuthStore.resetState();
    }
  } catch (error) {
    console.error("There's problems fetching the user", error.message)
  }
    
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
