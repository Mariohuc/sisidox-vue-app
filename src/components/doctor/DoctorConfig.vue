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
                              <v-btn :disabled="!DoctorExists" color="gray" fab dark absolute top right @click.stop="avatarDialog = true">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </v-fab-transition>
                            <div class="circle2">
                              <v-img class="avatar" :src="FormalPhotoUrl" :class="{ 'zoom-efect': hover }"></v-img>
                            </div>
                          </div>
                        </div>

                      </v-card-text>
                    </div>
                  </v-card>
                </v-hover>

                <v-dialog
                  v-model="avatarDialog"
                  max-width="700"
                  persistent
                >
                  <v-toolbar dark color="blue">
                    <v-icon class="mr-2">mdi-camera</v-icon>
                    <v-toolbar-title>Actualización de foto de perfil</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="avatarDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>

                  </v-toolbar>
                  <DoctorAvatarEditor @photoSubmittedEvent="avatarDialog = false" />
                </v-dialog>

              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="gender"
                  :rules="[(v) => v.code !== '' || 'Es requerido']"
                  label="Prefíjo"
                  :items="genders"
                  item-text="name"
                  item-value="code"
                  persistent-hint
                  return-object
                  @change="genderOnChange()"
                  :readonly="DoctorExists || readingModeFlag"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="doctorData.fullname"
                  :counter="50"
                  :rules="[(v) => !!v || 'Debes introducir tu nombre completo']"
                  label="Nombre completo"
                  required
                  :readonly="readingModeFlag"
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
                  :readonly="readingModeFlag"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="doctorData.cmpNumber"
                  label="Indica tu CMP"
                  :rules="[(v) => !!v || 'Debes indicar tu CMP']"
                  required
                  :readonly="readingModeFlag"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  type="number"
                  :rules="[(v) => v > 0 && v < 99 || 'Cantidad inválida' ]"
                  v-model="doctorData.appointmentCost"
                  label="Indica tu precio por una consulta"
                  required
                  :readonly="readingModeFlag"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  filled
                  label="Escribe una pequeña introducción personal"
                  auto-grow
                  v-model="doctorData.personalDescription"
                  :counter="200"
                  :readonly="readingModeFlag"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center mb-6">
              <v-col cols="12" sm="2">
                <v-btn v-if="readingModeFlag" color="primary" class="mr-4" @click="readingModeFlag = false">
                  Editar
                </v-btn>
                <v-btn v-if="!readingModeFlag" :disabled="!valid || formDDstatus === 2" :loading="formDDstatus === 1" color="success" class="mr-4" @click="saveOrUpdateDoctorData()">
                  Guardar
                </v-btn>               
              </v-col>
              <v-col v-if="!readingModeFlag" cols="12" sm="2">
                <v-btn color="error" class="mr-4" @click="readingModeFlag = true">
                  Cancelar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          Métodos de pago
          <template v-slot:actions>
            <v-icon color="primary"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <PaymentMethods></PaymentMethods>
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
import { DoctorData, DictionaryWord, WordType } from "@/store/models";
import { Component, Vue, Watch } from "vue-property-decorator";
import MedicalDictionaryStore from "@/store/modules/medicalDictionary";
import DoctorDataStore from "@/store/modules/doctorData";
import AuthStore from "@/store/modules/auth";

import DoctorAvatarEditor from "@/components/doctor/DoctorAvatarEditor.vue";
import PaymentMethods from "@/components/doctor/PaymentMethods.vue"

@Component({
  name: "DoctorConfig",
  components: {
    DoctorAvatarEditor,
    PaymentMethods
  }
})
export default class DoctorConfig extends Vue {
  valid = true;
  specialties: DictionaryWord[] = [];
  specialty = { codeword: "", name: "" }
  gender = { name: "", code: "" }
  genders = [ { name: 'Dr.', code: 'M' }, { name: 'Dra.', code: 'F' } ]
  doctorData : DoctorData = {
    doctorId: AuthStore.uid,
    fullname: "",
    specialty: "",
    cmpNumber: "",
    gender: "",
    appointmentCost: 0,
    formalPhotoUrl: "",
    personalDescription: "",
    createdAt: "",
    updatedAt: "",
    recordStatus: "",
  };
  formDDMsg = "";
  formDDstatus = 0;

  avatarDialog = false
  readingModeFlag = false
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
       this.readingModeFlag = true;
    } catch (error) {
      this.formDDstatus = 3;
      this.formDDMsg = "Upps, error! Intentalo más tarde"
    }finally{
      setTimeout(()=> this.formDDMsg = "", 2000)
    }
  }
  genderOnChange(): void {
    this.doctorData.gender = this.gender.code
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
      /* Setting gender selector */
      const temp2 = this.genders.find( item => item.code === this.doctorData.gender );
      if(temp2){
        this.gender = temp2
      }
      this.readingModeFlag = true
    }
      
  }
  get DoctorExists(): boolean {
    return DoctorDataStore.doctorExists
  }
  get FormalPhotoUrl(): string {
    return DoctorDataStore.doctorData.formalPhotoUrl || "/img/generic/doctor-default.png"
  }
}
</script>

<style scoped>
.card-2 {
  transition: 0.5s ease-out;
}

.card-2 .v-image {
  transition: 0.75s;
}

.card-2 h1 {
  margin-bottom: 10px;
}

.up-2 {
  transform: translateY(-15px);
  transition: 0.5s ease-out;
}

.circle1 {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  background-color: #f0f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle2 {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  background-color: #e0effc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-border-rounded svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #f4f7f5;
  z-index: -1;
}

#pricing {
  z-index: 0;
}

.content {
  z-index: 1;
}

svg {
  overflow: hidden;
}

section {
  position: relative;
}
.avatar {
  border-radius: 50%;
}
</style>
