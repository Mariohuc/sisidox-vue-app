<template>
  <v-card class="mt-5" flat>
    <v-card v-if="mode === 'LIST'">
      <v-row class="fill-height">
        <v-col v-for="(item, i) in patients" :key="i" cols="12" sm="6" md="4">
          <v-card
            color="primary"
            dark
            class="d-flex flex-row align-center mx-auto my-2"
          >
            <v-text-field
              label="Paciente"
              placeholder=""
              v-model="item.name"
              readonly
              hide-details
              class="mx-3 my-3"
            ></v-text-field>

            <v-btn color="pink" class="mx-3 my-3" @click="watchDetail()" fab small dark>
              <v-icon>mdi-file-account</v-icon>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <MedicalRecordDetail v-if="mode === 'HISTORY'" v-on:changeMode="modeList()"></MedicalRecordDetail>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MedicalRecordDetail from "./MedicalRecordDetail.vue";

@Component({
  name: "MedicalRecords",
  components:{
    MedicalRecordDetail
  }
})
export default class MedicalRecords extends Vue {
  loading = false;
  selection = 1;
  mode = '';
  modes = ['LIST', 'HISTORY']
  patients = [
    {
      name: "JULIETA VENEGA",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "15 de mayo 2021 8:00 AM"
    },
    {
      name: "FRANCISCO TORRES",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "16 de mayo 2021 8:00 AM"
    },
    {
      name: "RAUL ROMERO",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "16 de mayo 2021 8:00 AM"
    },
    {
      name: "EDUARDO GUTIERREZ GAMES",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "16 de mayo 2021 8:00 AM"
    },
    {
      name: "RODOLFO ELRENO",
      date: "18 de mayo 2021 8:00 AM",
      lastModified: "15 de mayo 2021 9:00 AM"
    }
  ];
  created():void{
    this.modeList()
  }
  watchDetail(): void{
    this.mode = this.modes[1]
  }
  modeList(): void{
    this.mode = this.modes[0]
  }
  reserve() {
    this.loading = true;

    setTimeout(() => (this.loading = false), 2000);
  }
}
</script>

<style></style>
