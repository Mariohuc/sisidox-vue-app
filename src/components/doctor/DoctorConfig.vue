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
              <v-col cols="12" md="4">
                <v-hover v-slot:default="{ hover }">
                  <v-card class="card-2" :elevation="hover ? 10 : 4" :class="{ 'up-2': hover }">
                    <div class="flex-center">
                      <v-card-text>
                        <div class="flex-center">
                          <div class="circle1">
                            <v-fab-transition>
                              <v-btn color="gray" fab dark absolute top right>
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </v-fab-transition>
                            <div class="circle2">
                              <v-img src="/img/generic/doctor-default.png" :class="{ 'zoom-efect': hover }"></v-img>
                            </div>
                          </div>
                        </div>

                      </v-card-text>
                    </div>
                  </v-card>
                </v-hover>

              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="doctorData.fullname"
                  :counter="50"
                  :rules="[(v) => !!v || 'Debes introducir tu nombre completo']"
                  label="Nombre completo"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="specialty"
                  :rules="[(v) => v.codeword !== '' || 'Debes escoger una especialidad']"
                  label="Especialidad"
                  :hint="`${specialty.name}, ${specialty.codeword}`"
                  :items="specialties"
                  item-text="name"
                  item-value="codeword"
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
                <v-btn :disabled="!valid || formDDstatus === 2" :loading="formDDstatus === 1" color="success" class="mr-4" @click="saveOrUpdateDoctorData()">
                  Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-snackbar v-model="snackbarDD" :color="snackbarDDColor">
      {{ formDDMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { DoctorData } from "@/store/models";
import { Component, Vue, Watch } from "vue-property-decorator";
import MedicalDictionaryStore from "@/store/modules/medicalDictionary";
import DoctorDataStore from "@/store/modules/doctorData";
import AuthStore from "@/store/modules/auth";
import { DictionaryWord, WordType } from "@/store/models";
import { DateTime } from "luxon";

@Component({
  name: "DoctorConfig"
})
export default class DoctorConfig extends Vue {
  valid = true;
  specialties: DictionaryWord[] = [];
  specialty = { codeword: "", name: "" }
  doctorData : DoctorData = {
    doctorId: AuthStore.uid,
    fullname: "",
    specialty: "",
    cmpNumber: "",
    appointmentCost: 0,
    formalPhotoUrl: "",
    personalDescription: "",
    createdAt: "",
    updatedAt: "",
    recordStatus: "",
  };
  formDDMsg = "";
  formDDstatus = 0;

  get snackbarDD(){
    return this.formDDMsg !== ""
  }
  get snackbarDDColor(){
    if( this.formDDstatus === 3 ) return 'warning';
    return 'success';
  }

  async mounted(): Promise<void> {
    if (this.specialties.length === 0) {
      await MedicalDictionaryStore.fetchWordsBy({ type: WordType.SPECIALTY, recordStatus: 'A' });
      this.specialties = MedicalDictionaryStore.currentWords;
    }
    await this.getDoctorData()
  }

  @Watch("specialty")
  specialtySelect(val: any): void {
    this.doctorData.specialty = val.codeword;
  }
  async saveOrUpdateDoctorData(): Promise<void> {
    try {
      this.formDDstatus = 1;
      this.doctorData.recordStatus = "A";
      await DoctorDataStore.saveOrUpdateDoctorData(this.doctorData)
       this.formDDstatus = 2;
       this.formDDMsg = "Bien hecho!";
    } catch (error) {
      this.formDDstatus = 3;
      this.formDDMsg = "Upps, error! Intentalo más tarde"
    }finally{
      setTimeout(()=> this.formDDMsg = "", 2000)
    }
  }

  async getDoctorData(): Promise<void> {
    await DoctorDataStore.getDoctorData( AuthStore.uid );
    if( DoctorDataStore.doctorExists ){
      this.doctorData = DoctorDataStore.doctorData;
      /* Setting specialty selector */
      const temp = this.specialties.find( item => item.codeword === this.doctorData.specialty );
      if(temp){
        this.specialty.codeword = temp.codeword;
        this.specialty.name = temp.name;
      }
    }
      
  }
}
</script>

<style scoped>
.circle1 {
  border-radius: 50%;
  width: 250px;
  height: 250px;
  background-color: #f0f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle2 {
  border-radius: 50%;
  width: 220px;
  height: 220px;
  background-color: #e0effc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
