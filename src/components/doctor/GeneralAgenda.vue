<template>
  <v-card flat>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Hoy
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[calendarType] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="calendarType = 'day'">
                  <v-list-item-title>Día</v-list-item-title>
                </v-list-item>
                <v-list-item @click="calendarType = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="500">
          <v-calendar
            :key="componentKey"
            ref="calendar"
            v-model="focus"
            color="primary"
            :first-interval="6"
            :interval-count="15"
            :events="events"
            :event-color="getEventColor"
            :type="calendarType"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-dialog
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            width="400"
          >
            <v-card color="grey lighten-4" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title
                  v-html="'Estado: ' + selectedEvent.name"
                ></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text class="d-flex align-center justify-center py-3">
                <v-btn class="ma-2" outlined :color="selectedEvent.color">
                  <v-icon right dark class="mr-2">
                    mdi-clipboard-list-outline
                  </v-icon>
                  Cita N° {{ selectedEvent.id }}
                </v-btn>
              </v-card-text>
              <v-divider class="my-0"></v-divider>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cerrar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="selectedEvent.appointment_status === 0"
                  text
                  color="error"
                  @click="deleteAppointment(selectedEvent.id)"
                >
                  Eliminar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-sheet>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-chip class="ma-2" chip color="#fc6a03" text-color="white"
          >Libres</v-chip
        >
        <v-chip class="ma-2" chip color="rgb(229,190,1)" text-color="white"
          >Programadas</v-chip
        >
        <v-chip class="ma-2" chip color="green" text-color="white"
          >En Curso</v-chip
        >
        <v-chip class="ma-2" chip color="#d50000" text-color="white"
          >Finalizadas</v-chip
        >
        <v-chip class="ma-2" chip color="#9c9c9c" text-color="white"
          >Liquidadas</v-chip
        >
      </v-col>
    </v-row>
    <p class="text-h6 my-2">
      <v-icon class="mr-1 mb-1"> mdi-table-plus </v-icon>
      Agregar nuevas citas - especialidad:
    </p>
    <v-divider class="mb-4"></v-divider>
    <v-form v-model="validAppt" ref="apptForm">
      <v-row>
        <v-col cols="12" sm="6">
          <v-row>
            <v-col cols="12">
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editAppt.start_d"
                    label="Fecha de nueva(s) cita(s)"
                    :rules="eaRules.start_d"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editAppt.start_d"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="4">
              <v-menu
                ref="menust"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="editAppt.start_t"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editAppt.start_t"
                    label="Desde (formato 24hrs)"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="editAppt.start_t"
                  full-width
                  format="24hr"
                  :allowed-minutes="allowed_minutes"
                  :allowed-hours="allowed_hours"
                  @click:minute="$refs.menust.save(editAppt.start_t)"
                ></v-time-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                type="number"
                v-model="editAppt.num_appts"
                :rules="eaRules.num_appts"
                prepend-icon="mdi-clipboard-list-outline"
                label="# citas según rango escogido"
                readonly
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-menu
                ref="menuet"
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="editAppt.end_t"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editAppt.end_t"
                    label="Hasta (formato 24hrs)"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu3"
                  v-model="editAppt.end_t"
                  full-width
                  format="24hr"
                  :allowed-minutes="allowed_minutes"
                  :allowed-hours="allowed_hours"
                  @click:minute="$refs.menuet.save(editAppt.end_t)"
                ></v-time-picker>
              </v-menu>
            </v-col>

            <v-col cols="12">
              <v-subheader
                >Cada cita tienen una duración de 29 minutos por
                defecto.</v-subheader
              >
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6">
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="editAppt.cost"
                label="Costo (Soles)"
                :rules="eaRules.cost"
                prepend-icon="mdi-currency-usd-circle"
                :disabled="editAppt.is_free"
                @change="changeApptCost()"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-checkbox
                v-model="editAppt.is_free"
                label="Cita(s) gratuita(s)"
                @change="changeCheckBox1()"
              ></v-checkbox>
            </v-col>
            <v-col cols="6">
              <v-btn block :disabled="!validAppt" @click="saveAppointments">
                Añadir cita(s)
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="error"> Cancelar </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-alert
            v-if="throwWarn"
            dense
            border="left"
            type="warning"
            :key="err_componentKey"
            dismissible
          >
            El rango escogido esta atrasado con respecto a
            <strong>ahora</strong> o esta <strong>superponiendose</strong> sobre
            otras citas del calendario. El rango minimamente debe empezar en la
            hora siguiente con relación a la hora actual.
          </v-alert>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AppointmentsStore from "@/store/modules/appointments";

interface VCalendar extends Vue {
  checkChange(): void;
  prev(): void;
  next(): void;
}

@Component({
  name: "GeneralAgenda"
})
export default class GeneralAgenda extends Vue {
  $refs!: {
    calendar: VCalendar;
  };
  focus = "";
  calendarType = "week";
  typeToLabel = {
    week: "Semana",
    day: "Día"
  };
  selectedEvent = {};
  selectedElement = null;
  selectedOpen = false;
  validAppt = false;
  events = [];
  menu1 = false;
  menu2 = false;
  menu3 = false;
  num_appts = 1;
  editAppt = {
    start_d: "2021-05-03",
    start_t: "",
    num_appts: -1,
    end_t: "",
    is_free: false,
    cost: 20
  };
  defaultAppt = {
    start_d: "2021-05-03",
    start_t: "",
    num_appts: -1,
    end_t: "",
    is_free: false,
    cost: 20
  };
  eaRules = {
    start_d: [(v: string): string | boolean => !!v || "Mínimo la fecha actual"],
    num_appts: [
      (v: number): string | boolean => v > 0 || "Mínimo es 1",
      (v: number): string | boolean => v < 31 || "Máximo es 30"
    ],
    specialty: [
      (v: string): string | boolean => !!v || "Especialidad requerida"
    ],
    cost: [(v: number): string | boolean => v >= 0 || "Costo requerido"]
  };
  componentKey = 0;
  throwWarn = false;
  err_componentKey = 0;

  get allowed_minutes(): number[] {
    return [0, 30];
  }
  get allowed_hours(): number[] {
    let hours = [];
    for (let i = 6; i < 21; i++) {
      hours.push(i);
    }
    return hours;
  }

  @Watch("editAppt.start_t")
  editAppt_start_tChanged(val: any): void {
    console.log("Changed", val);
  }

  mounted(): void {
    this.$refs.calendar.checkChange();
  }
  viewDay({ date }: any): void {
    this.focus = date;
    this.calendarType = "day"; // 0 is for 'day'
  }
  getEventColor(event: any): any {
    return event.color;
  }
  setToday(): void {
    this.focus = "";
  }
  prev(): void {
    this.$refs.calendar.prev();
  }
  next(): void {
    this.$refs.calendar.next();
  }
  showEvent({ nativeEvent, event }: any): void {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      setTimeout(() => {
        this.selectedOpen = true;
      }, 10);
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      setTimeout(open, 10);
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  }
  async updateRange({ start, end }: any): Promise<void> {
    //console.log("Change", start, end);
    try {
      await AppointmentsStore.fetchAppointmentsByRange({ start: start.date, end: end.date });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }
  saveAppointments() {
    console.log("Saving", "Saved");
  }
  deleteAppointment(apptId: any) {
    console.log("Deleting", apptId);
  }
  changeApptCost(): void {
    if (this.editAppt.cost < 1) {
      this.editAppt.is_free = true;
    }
  }
  changeCheckBox1(): void {
    if (this.editAppt.is_free) {
      this.editAppt.cost = 0.0;
    } else {
      this.editAppt.cost = this.defaultAppt.cost;
    }
  }
}
</script>

<style></style>
