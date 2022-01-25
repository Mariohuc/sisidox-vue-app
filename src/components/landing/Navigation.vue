<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      dark
      src="@/assets/img/bgDrawer.jpg"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img src="@/assets/img/logo.png" alt="Logo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">Sisidocs</v-list-item-title>
            <v-list-item-subtitle>WEB</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list dense>
        <v-list-item
          v-for="([icon, text, link], i) in MenuItems"
          :key="i"
          link
          @click="goTo(link)"
        >
          <v-list-item-icon class="justify-center">
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="subtitile-1">{{
              text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item>
          <login :vertical="true"></login>
        </v-list-item>
      </v-list>   
    </v-navigation-drawer>

    <v-app-bar
      app
      :color="color"
      :flat="flat"
      dark
      class="px-15"
      :class="{ expand: flat }"
    >
      <v-toolbar-title>
        <v-img src="@/assets/img/logo.png" max-width="50px" />
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="mr-4"
        v-if="isXs"
      />
      <div v-else class="d-flex flex-row-reverse">
        <div v-if="LoggedIn">
          <v-btn text @click="goTo(RouteByRole)">
            <span class="mr-2">Dashboard</span>
          </v-btn>
          <login></login>
        </div>
        <div v-else>
          <v-btn text @click="$vuetify.goTo('#hero')">
            <span class="mr-2">Inicio</span>
          </v-btn>
          <v-btn text @click="$vuetify.goTo('#features')">
            <span class="mr-2">Nosotros</span>
          </v-btn>
          <v-btn text @click="$vuetify.goTo('#download')">
            <span class="mr-2">Como funciona</span>
          </v-btn>
          <v-btn text @click="$vuetify.goTo('#pricing')">
            <span class="mr-2">Reserva tu cita</span>
          </v-btn>
          <v-btn text @click="$vuetify.goTo('#contact')">
            <span class="mr-2">Contactanos</span>
          </v-btn>
          <login></login>
        </div>
        
      </div>
      
    </v-app-bar>
  </div>
</template>

<style scoped>
.v-toolbar {
  transition: 0.6s;
}

.expand {
  height: 80px !important;
  padding-top: 10px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import login from "@/components/Login.vue"
import AuthStore from "@/store/modules/auth";
import { Role } from "@/store/models";

@Component({
  name: "Navigation",
  components: { login }
})
export default class Navigation extends Vue {
  drawer = false;
  isXs = false;
  items = [
    ["mdi-home-outline", "Inicio", "#hero"],
    ["mdi-information-outline", "Nosotros", "#features"],
    ["mdi-download-box-outline", "Como funciona", "#download"],
    ["mdi-currency-usd", "Reserva tu cita", "#pricing"],
    ["mdi-email-outline", "Contactanos", "#contact"]
  ];
  @Prop(String) readonly color!: string;
  @Prop(Boolean) readonly flat!: boolean;

  onResize(): void {
    this.isXs = window.innerWidth < 850;
  }

  @Watch("isXs")
  isXsChange(value: any): void {
    if (!value) {
      if (this.drawer) {
        this.drawer = false;
      }
    }
  }

  mounted(): void {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  }
  get MenuItems(): Array<any> {
    if( AuthStore.uid ){
      return [ ["mdi-view-dashboard", "Dashboard", this.RouteByRole] ]
    }else{
      return [
        ["mdi-home-outline", "Inicio", "#hero"],
        ["mdi-information-outline", "Nosotros", "#features"],
        ["mdi-download-box-outline", "Como funciona", "#download"],
        ["mdi-currency-usd", "Reserva tu cita", "#pricing"],
        ["mdi-email-outline", "Contactanos", "#contact"]
      ]
    }
  }
  get LoggedIn(): boolean {
    return AuthStore.uid !== ""
  }
  get RouteByRole(): string {
    return this.getRouteByRole(AuthStore.currentUserMode);
  }
  getRouteByRole(role: Role): string {
    switch(role){
      case Role.ADMINISTRATOR: return '/admin';
      case Role.DOCTOR: return '/doctor';
      case Role.PATIENT: return '/patient';
      default: return '/';
    }
  }
  goTo(link: string): void{
    if( link.charAt(0) === '#' ){
      this.$vuetify.goTo(link)
    }else{
      this.$router.push({ path: link });
    }
  }
}
</script>
