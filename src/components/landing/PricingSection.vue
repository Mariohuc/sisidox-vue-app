<template>
  <section id="pricing" class="pb-8">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-card color="transparent" style="width: 100%" flat>
            <h1 class="text-center pt-6 font-weight-light display-2">
              Reserva tu cita
            </h1>
            
            <v-card-text>
              <v-list subheader two-line>
                <v-row class="d-flex justify-center my-3">
                  <v-col
                    v-for="spec in specialties"
                    :key="spec.id"
                    class="col-12 col-sm-5 py-0 d-flex justify-space-around"
                  >
                    <v-chip class="ma-2" color="indigo darken-3" large outlined style="width: 100%;" @click="goForBooking(spec)">
                      <span
                          class="medical-icon-i-health-services mx-2"
                          aria-hidden="true"
                          style="font-size: 2em;"
                        ></span> 
                      <span style="display: block;" class="text-truncate">{{ spec.name }}</span>
                    </v-chip>
                    
                  </v-col>
                </v-row>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="svg-border-rounded text-light">
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 144.54 17.34"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path
          d="M144.54,17.34H0V0H144.54ZM0,0S32.36,17.34,72.27,17.34,144.54,0,144.54,0"
        />
      </svg> -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path
          d="M0,64L80,90.7C160,117,320,171,480,181.3C640,192,800,160,960,138.7C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$main_color: #283e79;

ul {
  font-size: 13px;
  line-height: 1.5em;
  margin: 5px 0 15px;
  padding: 0;

  li {
    list-style: none;
    position: relative;
    padding: 0 0 0 20px;
  }

  li {
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 5px;
      width: 10px;
      height: 10px;
      background-color: $main_color;
      border-radius: 50%;
      -moz-border-radius: 50%;
      -webkit-eeborder-radius: 50%;
    }
  }
}

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
</style>

<style scoped>
.header {
  background-color: #283e79;
  color: white;
}

.circle1 {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  background-color: #f0f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle2 {
  border-radius: 50%;
  width: 100px;
  height: 100px;
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
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MedicalDictionaryStore from "@/store/modules/medicalDictionary";
import { DictionaryWord, WordType } from "@/store/models";
import DoctorSearchFiltersStore from "@/store/modules/doctorSearchFilters";

@Component({
  name: "PricingSection"
})
export default class PricingSection extends Vue {
  specialties: DictionaryWord[] = [];

  async mounted(): Promise<void> {
    try {
      await MedicalDictionaryStore.fetchWordsBy({
        type: WordType.SPECIALTY,
        recordStatus: "A"
      });
      this.specialties = MedicalDictionaryStore.currentWords;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  get size() {
    const size = {
      xs: "small",
      sm: "medium",
      md: "large",
      lg: "x-large",
      xl: "x-large"
    }[this.$vuetify.breakpoint.name];
    return size ? { [size]: true } : {};
  }

  goForBooking(item: DictionaryWord){
    DoctorSearchFiltersStore.SET_SPECIALTY(item)
    this.$router.push({ path: '/appointment-search' });
  }
}
</script>