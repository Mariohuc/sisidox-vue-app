<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-app-bar color="purple" dark app>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-avatar size="40" tile class="mr-2">
        <img src="/icono-sisidox.png" alt="Sisidox" class="ma-1" />
      </v-avatar>
      <v-toolbar-title>SISIDOX</v-toolbar-title>

      <v-spacer></v-spacer>
      <HorizontalAppbarMenu></HorizontalAppbarMenu>

      <template v-slot:extension>
        <v-tabs v-model="tab" centered center-active>
          <v-tabs-slider></v-tabs-slider>

          <v-tab
            v-for="(item, index) in items"
            :key="index"
            :href="'#' + item.state"
          >
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
            <DoctorConfig></DoctorConfig>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>

    <GeneralFooter color="purple" />
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
import GeneralAgenda from "@/components/doctor/GeneralAgenda.vue";
import ScheduledAppointments from "@/components/doctor/ScheduledAppointments.vue";
import MedicalRecords from "@/components/doctor/MedicalRecords.vue";
import DoctorConfig from "@/components/doctor/DoctorConfig.vue";
import HorizontalAppbarMenu from "@/components/HorizontalAppbarMenu.vue"
import GeneralFooter from "@/components/general/GeneralFooter.vue";

@Component({
  name: "Doctor",
  components: {
    GeneralAgenda,
    ScheduledAppointments,
    MedicalRecords,
    DoctorConfig,
    HorizontalAppbarMenu,
    GeneralFooter
  }
})
export default class Doctor extends Vue {
  title = "Sisidox | Panel de doctor";
  tab = null;
  items: Menu[] = [];

  text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  created(): void {
    document.title = this.title;
    this.getMenuItems();
  }
  getMenuItems(): void {
    MenuItemsStore.MENUITEMS.map((item) => {
      if (item.belongTo.find((rol) => rol === Role.DOCTOR))
        this.items.push(item);
    });
  }
}
</script>