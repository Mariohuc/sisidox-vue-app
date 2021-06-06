<template>
  <v-card class="ma-2" flat>
    <v-expansion-panels popout>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Perfíl de doctor
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="doctorData.fullnameOfDr"
                  :counter="50"
                  :rules="[(v) => !!v || 'Debes introducir tu nombre completo']"
                  label="Nombre completo"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="doctorData.specialty"
                  :rules="[(v) => !!v || 'Debes escoger una especialidad']"
                  label="Especialidad"
                  :hint="`${doctorData.specialty.name}, ${doctorData.specialty.uid}`"
                  :items="specialties"
                  item-text="name"
                  item-value="uid"
                  persistent-hint
                  return-object
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="doctorData.cmpNumber"
                  label="Indica tu CMP"
                  :rules="[(v) => !!v || 'Debes indicar tu CMP']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  type="number"
                  v-model="doctorData.appointmentCost"
                  label="Indica tu precio por una consulta"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  filled
                  label="Comentanos algo de ti"
                  auto-grow
                  v-model="doctorData.personalDescription"
                  :counter="200"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center mb-6">
              <v-col cols="12" sm="2">
                <v-btn :disabled="!valid" color="success" class="mr-4">
                  Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import { DoctorData } from "@/store/models";
import { Component, Vue } from "vue-property-decorator";
import MedicalDictionaryStore from "@/store/modules/medicalDictionary";
import { DictionaryWord, WordType } from "@/store/models";

@Component({
  name: "DoctorConfig"
})
export default class DoctorConfig extends Vue {
  valid = true;
  specialties: DictionaryWord[] = [];
  doctorData = {
    fullnameOfDr: "",
    specialty: { uid: "", name: "" },
    cmpNumber: "",
    appointmentCost: 0.0,
    personalDescription: "",
    disabled: false
  };

  async mounted() {
    if (this.specialties.length < 1) {
      await MedicalDictionaryStore.fetchWordsBy({ type: WordType.SPECIALTY });
      this.specialties = MedicalDictionaryStore.currentWords.filter(
        (item) => item.disabled === false
      );
    }
  }
}
</script>

<style></style>
