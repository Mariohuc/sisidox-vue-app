<template>
  <v-card class="overflow-hidden" flat>
    <v-app-bar color="deep-purple accent-4" dark app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Sisidox</v-toolbar-title>

      <v-spacer></v-spacer>

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
          <v-tab-item :value="'general-agenda'">
            <GeneralAgenda></GeneralAgenda>
          </v-tab-item>
          <v-tab-item :value="'medical-records'">
            <MedicalRecords></MedicalRecords>
          </v-tab-item>
          <v-tab-item :value="'scheduled-appointments'">
            <ScheduledAppointments></ScheduledAppointments>
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
import GeneralAgenda from "@/components/doctor/GeneralAgenda.vue";
import ScheduledAppointments from "@/components/doctor/ScheduledAppointments.vue";
import MedicalRecords from "@/components/doctor/MedicalRecords.vue";

@Component({
  name: "Doctor",
  components:{
    GeneralAgenda,
    ScheduledAppointments,
    MedicalRecords
  }
})
export default class Doctor extends Vue {
  title = "Sisidox | Panel de doctor";
  tab = null;
  items: Menu[] = [];

  text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  created(): void{
    document.title = this.title;
    this.getMenuItems();
  }
  getMenuItems(): void{
    MenuItemsStore.MENUITEMS.map(item => {
      if(item.belongTo.find( rol => rol === Role.DOCTOR)) this.items.push(item);
    })
  }
}
</script>

<style></style>
