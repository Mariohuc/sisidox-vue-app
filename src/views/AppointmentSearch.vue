<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-app-bar color="deep-purple accent-4" dark app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Busca tu cita</v-toolbar-title>

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
    </v-app-bar>
    <v-main>
      <v-card class="rounded-0 pa-4">
        <v-container>
          <v-row align="center" class="fill-height">
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                single-line
                hide-details
                dense
                :items="items"
                label="Selecciona especialidad"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                hide-details
                single-line
                placeholder="Nombre, lugar trabajo"
                dense
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-btn>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-container>
        <v-card class="mt-1" flat>
          <v-row class="fill-height">
            <v-col
              v-for="(item, i) in doctors"
              :key="i"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card :loading="item.loading" class="mx-0 my-0">
                <template slot="progress">
                  <v-progress-linear
                    color="deep-purple"
                    height="10"
                    indeterminate
                  ></v-progress-linear>
                </template>

                <v-card-text class="text-center p-0">
                  <v-avatar size="200">
                  <img
                    :src="item.photoUrl"
                    alt="John"
                  />
                </v-avatar>
                </v-card-text>
                
                <v-card-title style="display: block" class="text-truncate">{{ item.name }}</v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="4.5"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    ></v-rating>

                    <div class="grey--text ml-4">4.5 (413)</div>
                  </v-row>
                </v-card-text>

                <v-divider class="mx-4"></v-divider>

                <v-card-text>
                  <v-chip-group v-model="selection" column>
                    <v-chip color="indigo" text-color="white">
                      <v-avatar left> <v-icon>mdi-doctor</v-icon> </v-avatar
                      >PEDIATRIA</v-chip
                    >

                    <v-chip color="orange" text-color="white">
                      <v-avatar left>
                        <v-icon>mdi-cash</v-icon>
                      </v-avatar>
                      S/. {{ item.price.toFixed(2) }}
                    </v-chip>

                    <v-chip color="green" text-color="white">
                      <v-avatar left>
                        <v-icon dark>mdi-identifier</v-icon>
                      </v-avatar>
                      {{ item.cmp }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="deep-purple lighten-2" text @click="reserve(i)">
                    Citas disponibles
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GeneralAgenda from "@/components/doctor/GeneralAgenda.vue";
import ScheduledAppointments from "@/components/doctor/ScheduledAppointments.vue";

@Component({
  name: "AppointmentSearch",
  components: {
    GeneralAgenda,
    ScheduledAppointments
  }
})
export default class AppointmentSearch extends Vue {
  title = 'Sisidox | Busca tu cita';
  loading = false;
  selection = 1;
  items = ["PEDIATRIA", "DERMATOLOGIA", "CARDIOLOGIA", "MEDICINA GENERAL"];
  doctors = [
    {
      name: "Dr. ORESTES VETETA",
      price: 23.5,
      cmp: "34527",
      photoUrl: "/img/generic/doctor-default.png",
      loading: false
    },
    {
      name: "Dr. FRANCISCO JEVIEJAS",
      price: 23.5,
      cmp: "34567",
      photoUrl: "/img/generic/doctor-default.png",
      loading: false
    },
    {
      name: "Dr. RAUL ROMERO",
      price: 40.5,
      cmp: "34507",
      photoUrl: "/img/generic/doctor-default.png",
      loading: false
    },
    {
      name: "Dra. MICHELLE SOIFER GUTIERREZ",
      price: 23.5,
      cmp: "34564",
      photoUrl: "/img/generic/doctor-default.png",
      loading: false
    },
    {
      name: "Dra. RODOLFO ELRENO",
      price: 25.0,
      cmp: "34164",
      photoUrl: "/img/generic/doctor-default.png",
      loading: false
    }
  ];
  created(): void{
    document.title = this.title;
  }
  reserve(index: number): void {
    this.doctors[index].loading = true;
    setTimeout(() => (this.doctors[index].loading = false), 2000);
  }
}
</script>

<style></style>
