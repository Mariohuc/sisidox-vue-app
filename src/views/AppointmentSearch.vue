<template>
  <v-card class="rounded-0 overflow-hidden" flat>
    <v-app-bar color="deep-purple accent-4" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

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
      <v-container>
        <v-card v-if="!selectedDoctor" class="mb-2" flat>
          <v-card-title>
            <span class="headline ml-2"></span>
            <v-spacer></v-spacer>
            <v-btn @click="openDSFDialog()">
              <v-icon>mdi-account-search</v-icon> Filtrar
            </v-btn>
          </v-card-title>
          <v-card-subtitle
            >Todos nuestros doctores saben sudar la gota gorda.</v-card-subtitle
          >
          <v-card-text>
            <v-row class="fill-height">
              <v-col
                v-for="(item, i) in paginatedDoctors"
                :key="i"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    :loading="isTheSelectedDoctor(item)"
                    class="card-2"
                    :elevation="hover ? 10 : 4"
                    :class="{ 'up-2': hover }"
                  >
                    <div class="flex-center">
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
                            :src="
                              item.photoUrl
                                ? item.photoUrl
                                : 'img/generic/doctor-default.png'
                            "
                            :alt="item.fullname"
                          />
                        </v-avatar>
                      </v-card-text>

                      <v-card-title
                        style="display: block"
                        class="text-truncate text-subtitle-1"
                        >{{ item.fullname }}</v-card-title
                      >

                      <v-card-text>
                        <v-row align="center" class="mx-0">
                          <v-rating
                            :value="item.doctorRating ? item.doctorRating : 0.0"
                            color="amber"
                            dense
                            half-increments
                            readonly
                            size="14"
                          ></v-rating>

                          <div class="grey--text ml-4">
                            {{
                              item.doctorRating ? item.doctorRating : 0.0
                            }}
                            ({{ item.numberOfReviews }})
                          </div>
                        </v-row>
                      </v-card-text>

                      <v-divider class="mx-4"></v-divider>

                      <v-card-text>
                        <v-chip-group v-model="selection" column>
                          <v-chip
                            color="indigo"
                            text-color="white"
                            class="text-caption"
                          >
                            <v-avatar left>
                              <v-icon>mdi-doctor</v-icon> </v-avatar
                            >{{ item.specialtyName }}</v-chip
                          >

                          <v-chip
                            color="orange"
                            text-color="white"
                            class="text-caption"
                          >
                            <v-avatar left>
                              <v-icon>mdi-cash</v-icon>
                            </v-avatar>
                            S/. {{ item.appointmentCost.toFixed(2) }}
                          </v-chip>

                          <v-chip
                            color="green"
                            text-color="white"
                            class="text-caption"
                          >
                            <v-avatar left>
                              <v-icon dark>mdi-identifier</v-icon>
                            </v-avatar>
                            {{ item.cmpNumber }}
                          </v-chip>
                        </v-chip-group>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn
                          color="deep-purple lighten-2"
                          text
                          @click="selectDoctor(item)"
                        >
                          Reservar cita
                        </v-btn>
                      </v-card-actions>
                    </div>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-pagination
              v-model="page"
              :length="totalPages"
              @change="() => console.log('shiiiit ')"
            ></v-pagination>
          </v-card-actions>
        </v-card>

        <v-card v-else class="mb-2" flat>
          <v-card-title>Reserva una cita</v-card-title>
          <v-card-subtitle
            >Todos nuestros doctores saben sudar la gota gorda.</v-card-subtitle
          >                    
          <v-card-text>
            <ApptTicketsForBooking :doctor="selectedDoctor" />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="closeDialog()">Volver</v-btn>
          </v-card-actions>
    
        </v-card>

        <v-card>
          <v-dialog v-model="doctorSearchFilterDialog" max-width="500" persistent>
            <DoctorSearchFilter @closeDoctorSearchFilterEvent="doctorSearchFilterDialog = false" @filterDoctorsEvent="filterDoctors()" />
          </v-dialog>
        </v-card>
      </v-container>

    </v-main>
  </v-card>
</template>

<style lang="scss" scoped>
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GeneralAgenda from "@/components/doctor/GeneralAgenda.vue";
import ScheduledAppointments from "@/components/doctor/ScheduledAppointments.vue";
import BasicReportsStore from "@/store/modules/basicReports";
import DoctorSearchFiltersStore from "@/store/modules/doctorSearchFilters";
import { DoctorSum, WordType } from "@/store/models";
import SettingsStore from "@/store/modules/settings";
import { paginator } from "@/utilities/paginator";
import ApptTicketsForBooking from "@/components/doctor/ApptTicketsForBooking.vue";
import DoctorSearchFilter from "@/components/shared/DoctorSearchFilter.vue"

@Component({
  name: "AppointmentSearch",
  components: {
    GeneralAgenda,
    ScheduledAppointments,
    ApptTicketsForBooking,
    DoctorSearchFilter
  }
})
export default class AppointmentSearch extends Vue {
  page = 1;
  perPageItems = 20;
  totalPages = 1;
  drawer: any = null;
  title = "Sisidox | Busca tu cita";
  mainDialog = false;
  loading = false;
  selection = 1;
  specialty = { codeword: "", name: "" };
  
  allDoctors: any[] = [];
  paginatedDoctors: any[] = [];
  selectedDoctor: DoctorSum | null = null;

  doctorSearchFilterDialog = false

  created(): void {
    document.title = this.title;
    this.filterDoctors()
  }
  isTheSelectedDoctor(doctor: any): boolean {
    if (!this.selectedDoctor) return false;
    return this.selectedDoctor.doctorId === doctor.doctorId;
  }
  selectDoctor(doctor: any): void {
    this.selectedDoctor = doctor;
    this.mainDialog = true;
  }
  closeDialog(): void {
    this.mainDialog = false;
    this.selectedDoctor = null;
  }

  openDSFDialog(): void {
    this.doctorSearchFilterDialog = true;
  }

  async filterDoctors(): Promise<void> {

    this.allDoctors = await BasicReportsStore.getDoctorsSummary({
      page: 1,
      specialty: DoctorSearchFiltersStore.specialty.codeword || undefined,
      doctorName: DoctorSearchFiltersStore.searchWords || undefined,
      limit: SettingsStore.requestDataSize,
      recordStatus: "A"
    });
    const result = paginator(this.allDoctors, this.page, this.perPageItems);
    console.log(result);
    this.totalPages = result.total_pages;
    this.paginatedDoctors = result.data;

    if(this.doctorSearchFilterDialog) this.doctorSearchFilterDialog = false;
  }
}
</script>
