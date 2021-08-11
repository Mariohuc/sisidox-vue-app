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
                  v-html="'CITA: ' + selectedEvent.name"
                ></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text class="d-flex align-center justify-center py-3">
                <v-btn class="ma-2" outlined :color="selectedEvent.color">
                  <v-icon right dark class="mr-2">
                    mdi-clipboard-list-outline
                  </v-icon>
                  Cita N° {{ selectedEvent.uid }}
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

    <v-card v-if="isTheCurrentWeek">
      <v-card-title>
        <v-icon class="mr-1 mb-1"> mdi-table-plus </v-icon> Agregar nuevas citas
        - especialidad:
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <v-form v-model="validAppt" ref="mainForm">
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
                    :disabled="editAppt.isFree"
                    @change="changeApptCost()"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-checkbox
                    v-model="editAppt.isFree"
                    label="Cita(s) gratuita(s)"
                    @change="changeCheckBox1()"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="12" lg="6">
                  <v-btn
                    block
                    :disabled="!validAppt"
                    @click="saveNewApptTickets"
                    :loading="mainFormStatus === 1"
                  >
                    Añadir nuevo(s) turno(s)
                  </v-btn>
                </v-col>
                <v-col cols="12" md="12" lg="6">
                  <v-btn block color="error"> Cancelar </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-alert
                dense
                border="left"
                type="warning"
                :key="err_componentKey"
                dismissible
                transition="scale-transition"
                :value="throwWarn"
              >
                El rango escogido esta atrasado con respecto a
                <strong>ahora</strong> o esta
                <strong>superponiendose</strong> sobre otras citas del
                calendario. El rango minimamente debe empezar en la hora
                siguiente con relación a la hora actual.
              </v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AppointmentsStore from "@/store/modules/appointments";
import AuthStore from "@/store/modules/auth";
import { DateTime, Interval } from "luxon";
import { AppointmentTicket } from "@/store/models";

interface VCalendar extends Vue {
  checkChange(): void;
  prev(): void;
  next(): void;
}

interface VForm extends Vue {
  resetValidation(): void;
}

@Component({
  name: "GeneralAgenda"
})
export default class GeneralAgenda extends Vue {
  $refs!: {
    calendar: VCalendar;
    mainForm: VForm;
  };
  mainFormStatus = 0;
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
  events: AppointmentTicket[] = [];
  menu1 = false;
  menu2 = false;
  menu3 = false;
  num_appts = 1;
  editAppt = {
    start_d: "",
    start_t: "",
    num_appts: -1,
    end_t: "",
    isFree: false,
    cost: 20
  };
  defaultAppt = {
    start_d: DateTime.now().toFormat("yyyy-LL-dd"),
    start_t: "",
    num_appts: -1,
    end_t: "",
    isFree: false,
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
  isTheCurrentWeek = false;
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
    if (!this.editAppt.end_t) {
      return;
    }
    let start = DateTime.fromISO(val);
    let end = DateTime.fromISO(this.editAppt.end_t);
    if (start < end) {
      let diffInMinutes = end.diff(start, "minutes");
      this.editAppt.num_appts = diffInMinutes.toObject().minutes / 30;
      return;
    }
    this.editAppt.num_appts = -1;
  }

  @Watch("editAppt.end_t")
  editAppt_end_tChanged(val: any): void {
    if (!this.editAppt.start_t) {
      return;
    }
    let start = DateTime.fromISO(this.editAppt.start_t);
    let end = DateTime.fromISO(val);
    if (end > start) {
      let diffInMinutes = end.diff(start, "minutes");

      this.editAppt.num_appts = diffInMinutes.toObject().minutes / 30;
      return;
    }
    this.editAppt.num_appts = -1;
  }

  mounted(): void {
    this.$refs.calendar.checkChange();
    this.editAppt = Object.assign({}, this.defaultAppt);
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
      /* Check if it'is the current week so the add tickets form is shown */
      const endL = DateTime.fromISO(end.date).endOf('day');
      if ( endL >= DateTime.now()) {
        this.isTheCurrentWeek = true;
      } else {
        console.log('Out of range')
        this.isTheCurrentWeek = false;
      }
      /* Fetch all tickets from firebase */
      await AppointmentsStore.fetchApptTicketsByRange({
        start: start.date,
        end: end.date,
        doctorUID: AuthStore.uid
      });
      this.events = AppointmentsStore.currentApptTicketsRange;
      //this.componentKey += 1; // TO RE-RENDER THE V-CALENDAR
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }
  async saveNewApptTickets(): Promise<void> {
    try { 
      this.throwWarn = false;
      const start = DateTime.fromISO( this.editAppt.start_d + "T" + this.editAppt.start_t );
      const end = DateTime.fromISO( this.editAppt.start_d + "T" + this.editAppt.end_t );
      /* Check if some event overlap the new interval */
      if( this.checkIfNewTicketsAreInvalid( start, end ) ){
        setTimeout( () => this.throwWarn = true, 100 )
        return;
      }
      this.mainFormStatus = 1;
      const DATA = {
        start,
        end,
        cost: this.editAppt.cost,
        isFree: this.editAppt.isFree,
        doctorId: AuthStore.uid
      };
      await AppointmentsStore.saveNewApptTickets(DATA);
      this.editAppt = Object.assign({}, this.defaultAppt);
      this.throwWarn = false;
      this.$refs.mainForm.resetValidation();
      this.mainFormStatus = 2;
      this.componentKey += 1
    } catch (error) {
      this.mainFormStatus = 3;
    }
  }
  deleteAppointment(apptId: any) {
    console.log("Deleting", apptId);
  }
  changeApptCost(): void {
    if (this.editAppt.cost < 1) {
      this.editAppt.isFree = true;
    }
  }
  changeCheckBox1(): void {
    if (this.editAppt.isFree) {
      this.editAppt.cost = 0.0;
    } else {
      this.editAppt.cost = this.defaultAppt.cost;
    }
  }
  checkIfNewTicketsAreInvalid(newLStart: any, newLEnd: any) {
    if( newLStart < DateTime.now().plus({ hours: 2 }) ){ // 1. It's less than the current time plus 2 hours
      return true;
    }
    const newInterval = Interval.fromDateTimes(newLStart, newLEnd);
    for (let i = 0; i < this.events.length; i++) {
      let currentInt = Interval.fromDateTimes(
        DateTime.fromFormat(this.events[i].start, "yyyy-LL-dd HH:mm"),
        DateTime.fromFormat(this.events[i].end, "yyyy-LL-dd HH:mm")
      );
      if( newInterval.overlaps(currentInt) ) return true; // 2. intervals overlap
    }
    return false
  }
}
</script>

<style></style>
