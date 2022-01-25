<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-app-bar color="blue" dark app>
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
          <v-tab-item :value="'booked-appointments'">
            <BookedAppointments></BookedAppointments>
          </v-tab-item>
          <v-tab-item :value="'medical-record'">
            <MedicalRecordDetail></MedicalRecordDetail>
          </v-tab-item>
          <v-tab-item :value="'configurations'">
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>

    <GeneralFooter />

  </v-card>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuItemsStore from "@/store/modules/menuItems";
import { Menu, Role } from "@/store/models";
import BookedAppointments from "@/components/patient/BookedAppointments.vue";
import MedicalRecordDetail from "@/components/patient/MedicalRecordDetail.vue";
import HorizontalAppbarMenu from "@/components/HorizontalAppbarMenu.vue";
import GeneralFooter from "@/components/general/GeneralFooter.vue";

@Component({
  name: "Patient",
  components: {
    BookedAppointments,
    MedicalRecordDetail,
    HorizontalAppbarMenu,
    GeneralFooter
  }
})
export default class Patient extends Vue {
  title = "Sisidox | Panel de paciente";
  tab = null;
  items: Menu[] = [];

  text = "";
  created(): void {
    document.title = this.title;
    this.getMenuItems();
  }

  getMenuItems(): void {
    MenuItemsStore.MENUITEMS.map((item) => {
      if (item.belongTo.find((rol) => rol === Role.PATIENT))
        this.items.push(item);
    });
  }
}
</script>

<style></style>
