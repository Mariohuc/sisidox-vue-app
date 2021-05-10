<template>
  <v-card class="overflow-hidden">
    <v-app-bar color="light-green darken-4" dark app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>SISIDOX</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
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
      <template v-slot:extension>
        <v-tabs v-model="tab" centered center-active dark>
          <v-tabs-slider></v-tabs-slider>

          <v-tab v-for="(item, index) in items" :key="index" :href="'#'+item.state">
            <v-avatar tile size="36" class="mr-2">
              <img :src="item.imagePath" alt="" />
            </v-avatar>
            {{ item.name }}
          </v-tab>

        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-tabs-items v-model="tab">
          <v-tab-item :value="'booked-appointments'">
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'medical-record'">
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'configurations'">
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuItemsStore from "@/store/modules/menuItems";
import { Menu, Role } from "@/store/models";

@Component({
  name: "Patient"
})
export default class Patient extends Vue {
  tab = null;
  items: Menu[] = [];

  text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  created(): void{
    this.getMenuItems();
  }
  getMenuItems(): void{
    MenuItemsStore.MENUITEMS.map(item => {
      if(item.belongTo.find( rol => rol === Role.PATIENT)) this.items.push(item);
    })
  }
}
</script>

<style></style>
