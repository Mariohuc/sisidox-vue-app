<template>
  <v-card class="mt-5" flat>
    <v-card class="d-flex flex-row mx-4 mt-2" flat tile>
      <v-text-field
        value="JULIETA VENEGAS"
        label="Historial de"
        outlined
        readonly
      ></v-text-field>
    </v-card>
    <v-expansion-panels popout>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Alergias
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="5">
              <v-card class="d-flex flex-row" flat tile>
                <v-text-field
                  value=""
                  label="Nueva alergia"
                  outlined
                  readonly
                  dense
                ></v-text-field>
                <v-btn class="ml-4" color="primary">
                  <v-icon dark class="mr-1"> mdi-plus-circle </v-icon>
                  Añadir
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-chip-group v-model="selection" column>
            <v-chip v-for="(item, i) in allergies" :key="i" color="amber accent-4" text-color="white" close @click:close="removeAllergy(i)">
              <v-avatar left> <v-icon>mdi-emoticon-sick</v-icon> </v-avatar
              >{{ item }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Enfermedades
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="5">
              <v-card class="d-flex flex-row" flat tile>
                <v-text-field
                  value=""
                  label="Nueva enfermedad"
                  outlined
                  readonly
                  dense
                ></v-text-field>
                <v-btn class="ml-4" color="primary">
                  <v-icon dark class="mr-1"> mdi-plus-circle </v-icon>
                  Añadir
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-chip-group v-model="selection" column>
            <v-chip v-for="(item, i) in diseases" :key="i" color="red" text-color="white" close @click:close="removeDisease(i)">
              <v-avatar left> <v-icon>mdi-emoticon-sick</v-icon> </v-avatar
              >{{ item }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Consultas previas
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="d-flex flex-row-reverse mx-4 my-4" flat tile>
      <v-btn @click="backToList()" color="secondary">
        <v-icon dark class="mr-1"> mdi-arrow-left-circle </v-icon> Atrás
      </v-btn>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "MedicalRecordDetail"
})
export default class MedicalRecordDetail extends Vue {
  diseases = [
    'Sida',
    'Sifilis',
    'Cáncer de cólon',
    'Diabetes'
  ];
  allergies = [
    'Asma',
    'Rinitis',
    'Conjuntivitis',
    'Dermatitis',
    'Urticaria'
  ];
  backToList(): void {
    this.$emit("changeMode");
  }
  removeDisease(index: number): void{
    this.diseases.splice(index, 1)
  }
  removeAllergy(index: number): void{
    this.allergies.splice(index, 1)
  }
}
</script>

<style></style>
