<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-navigation-drawer
      v-model="drawer"
      color="success"
      :expand-on-hover="false"
      :mini-variant="miniVariant"
      :left="true"
      :clipped="$vuetify.breakpoint.lgAndUp"
      dark
      app
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <img :src="photoUrl" :alt="displayName">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="displayName"></v-list-item-title>
            
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in navigationItems"
            :key="i"
            :to="item.state"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="success" dark :clipped-left="$vuetify.breakpoint.lgAndUp" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-avatar size="40" tile class="mr-2">
        <img src="/icono-sisidox.png" alt="Sisidox" class="ma-1" />
      </v-avatar>
      <v-toolbar-title>SISIDOX</v-toolbar-title>

      <v-spacer></v-spacer>
      <HorizontalAppbarMenu></HorizontalAppbarMenu>
    </v-app-bar>
    
      
    <router-view></router-view>
      

    <GeneralFooter color="success" />
  </v-card>
</template>

<style scoped>
.footer {
  width: 100%;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuItemsStore from "@/store/modules/menuItems";
import { Menu, Role } from "@/store/models";
import HorizontalAppbarMenu from "@/components/HorizontalAppbarMenu.vue"
import GeneralFooter from "@/components/general/GeneralFooter.vue";
import AuthStore from "@/store/modules/auth";

@Component({
  name: "Doctor",
  components: {
    HorizontalAppbarMenu,
    GeneralFooter
  }
})
export default class Admin extends Vue {
  drawer = true
  miniVariant = false
  title = "Sisidox | Panel de doctor";
  tab = null;
  navigationItems: Menu[] = [];

  
  text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  get photoUrl(): string {
    return AuthStore.photoURL;
  }
  get displayName(): string{
    return AuthStore.displayName;
  }
  created(): void {
    document.title = this.title;
    this.getMenuItems();
  }
  getMenuItems(): void {
    MenuItemsStore.MENUITEMS.forEach((item) => {
      if (item.belongTo.find((rol) => rol === Role.ADMINISTRATOR))
        this.navigationItems.push(item);
    });
  }
}
</script>