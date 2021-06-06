<template>
  <div class="my-2">
    <v-card>
      <v-card-text>
        <v-row justify="center">
        <v-chip class="ma-2">
          <v-avatar size="36" left class="amber accent-4"> </v-avatar>
          Programadas
        </v-chip>
        <v-chip class="ma-2">
          <v-avatar size="36" left class="green accent-4"> </v-avatar>
          En curso
        </v-chip>
        <v-chip class="ma-2">
          <v-avatar size="36" left class="red accent-4"> </v-avatar>
          Finalizadas
        </v-chip>
      </v-row>
      </v-card-text>
    </v-card>
    <v-row class="fill-height mt-6">
      <v-col
        v-for="(item, i) in doctors"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card color="purple accent-3" dark class="mx-0 my-0">
          <v-fab-transition>
            <v-btn :color="item.color" fab dark absolute top right>
              <v-icon>mdi-calendar-cursor</v-icon>
            </v-btn>
          </v-fab-transition>
          <v-card-text>
            <v-row align="center" class="mx-0 my-0">
              <v-col cols="12">
                <v-text-field
                  label="Doctor"
                  placeholder=""
                  v-model="item.name"
                  readonly
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Fecha"
                  placeholder=""
                  v-model="item.date"
                  readonly
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Ultima modificación"
                  placeholder=""
                  v-model="item.lastModified"
                  readonly
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "BookedAppointments"
})
export default class BookedAppointments extends Vue {
  loading = false;
  selection = 1;

  doctors = [
    {
      name: "ORESTER VERA",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "15 de mayo 2021 8:00 AM",
      color: "amber accent-4"
    },
    {
      name: "FRANCISCO TORRES",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "16 de mayo 2021 8:00 AM",
      color: "amber accent-4"
    },
    {
      name: "RAUL ROMERO",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "16 de mayo 2021 8:00 AM",
      color: "red accent-4"
    },
    {
      name: "EDUARDO GUTIERREZ GAMES",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "16 de mayo 2021 8:00 AM",
      color: "red accent-4"
    },
    {
      name: "RODOLFO ELRENO",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "15 de mayo 2021 9:00 AM",
      color: "green accent-4"
    }
  ];

  reserve() {
    this.loading = true;

    setTimeout(() => (this.loading = false), 2000);
  }
}
</script>

<style></style>
