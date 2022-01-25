<template>
  <div>
    <v-card flat>
      <v-card-title>
        <v-avatar color="primary">
          <v-icon dark>mdi-filter</v-icon>
        </v-avatar>
        <span class="headline ml-2">Busca a tu médico</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="text-center">
        <v-form ref="form" v-model="valid">
          <v-select
            v-model="specialty"
            label="Selecciona una especialidad"
            :items="specialties"
            item-text="name"
            item-value="codeword"
            persistent-hint
            return-object
            @change="specialtyChange()"
            required
          ></v-select>
         
          <v-text-field
            single-line
            placeholder="Nombre, lugar trabajo"
            @input="searchWordsChange($event)"
            dense
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            color="primary"
            :dark="valid"
            rounded
            class="mt-3"
            @click="filter()"
          >
            Filtrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import { SnackBarParams } from "@/store/models";
import { WordType } from "@/store/models";
import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue";
import { getSnackBarErrorParams } from "@/general-utils";
import MedicalDictionaryStore from "@/store/modules/medicalDictionary";
import DoctorSearchFiltersStore from "@/store/modules/doctorSearchFilters";

@Component({
  name: "DoctorSearchFilter",
  components: {
    GeneralSnackBar
  }
})
export default class DoctorSearchFilter extends Vue {

  specialty = { codeword: "", name: "" };
  searchWords = ""
  specialties: any[] = [];

  valid = false

  created(): void {
    this.getSpecialties()
    this.loadState()
  }

  loadState(): void {
    this.specialty = DoctorSearchFiltersStore.specialty;
    this.searchWords = DoctorSearchFiltersStore.searchWords;
  }

  specialtyChange(): void {
    DoctorSearchFiltersStore.SET_SPECIALTY(this.specialty)
  }
  searchWordsChange(val: string): void {
    DoctorSearchFiltersStore.SET_SEARCHWORDS(val)
  }

  async getSpecialties(): Promise<void> {
    if (this.specialties.length === 0) {
      await MedicalDictionaryStore.fetchWordsBy({
        type: WordType.SPECIALTY,
        recordStatus: "A"
      });
      this.specialties = [{ codeword: "", name: "TODAS LAS ESPECIALIDADES" }];
      this.specialties = this.specialties.concat(MedicalDictionaryStore.currentWords)
    }
  }
  
  close(): void {
    this.$emit("closeDoctorSearchFilterEvent");
  }
  filter(): void {
    this.$emit("filterDoctorsEvent")
  }
}
</script>

<style scoped>
</style>