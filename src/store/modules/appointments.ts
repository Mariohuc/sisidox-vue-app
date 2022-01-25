import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import {
  AppointmentTicket, AppStatus
} from "../models";
import store from "@/store";
import firebase from "firebase";
import { DateTime } from "luxon";
import HTTP from "@/http";

config.rawError = true;
//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "appointmentsStore"
})
class AppointmentsStore extends VuexModule {
  public currentApptTicketsRange: AppointmentTicket[] = [];
  /* An @Action only can receive one argument */
  public SCHEDULED_STATUS: AppStatus = { label: 'PROGRAMADA', color: 'amber accent-4' };
  public ONGOING_STATUS: AppStatus = { label: 'EN_CURSO', color: 'green accent-4' };
  public FINISHED_STATUS: AppStatus = { label: 'FINALIZADA', color: 'red accent-4' };

  get AppStatusLabels(): { [key:string]: string } {
    return { 'PROGRAMADA': 'PROGRAMADA', 'EN_CURSO': 'EN CURSO', 'FINALIZADA': 'FINALIZADA' }
  }

  @Mutation
  SET_CURRENTAPPTTICKETSRANGE(val: AppointmentTicket[]) {
    this.currentApptTicketsRange = val;
  }
  

  @Action
  async fetchAllTicketsAndAppointment(range: {
    start: string | Date;
    end: string | Date;
    doctorUID: string;
    recordStatus: 'A' | 'I' | '*';
  }): Promise<Array<any>> {
    const result: Array<any> = []

    const result1: any[] = await this.fetchApptTicketsByRange(range);
    const result2: any[] = await this.fetchAppointments(range);

    return result1.concat(result2);
  }

  @Action
  async fetchAppointments(range: {
    start: string | Date;
    end: string | Date;
    doctorUID: string;
    recordStatus: 'A' | 'I' | '*';
  }) {
    const { start, end, doctorUID, recordStatus } = range;
    const rangeStart = DateTime.fromISO(`${start}T00:00:00`).setZone("utc").toFormat('yyyy-LL-dd HH:mm:ss');
    const rangeEnd = DateTime.fromISO(`${end}T23:30:00`).setZone("utc").toFormat('yyyy-LL-dd HH:mm:ss');

    const appointments: any[] = [];
    const result = await HTTP().get('/booked-appointments' , { params: { rangeStart, rangeEnd, doctorId: doctorUID, recordStatus }});
    const DATA : Array<any> = result.data.data;
    DATA.forEach((item) => {
      // doc.data() is never undefined for query doc snapshots
      const { id, startTime, endTime, doctorId, apptStatus } = item;

      const record: any = {
        id,
        name: apptStatus ? this.AppStatusLabels[`${apptStatus}`] : 'SIN ESTADO',
        start: DateTime.fromISO(startTime).toFormat("yyyy-LL-dd HH:mm"),
        end: DateTime.fromISO(endTime).toFormat("yyyy-LL-dd HH:mm"),
        startTime,
        endTime,
        color: "grey",
        doctorId
      };
      appointments.push(record);
    });

    return appointments;
  }

  @Action
  async fetchApptTicketsByRange(range: {
    start: string | Date;
    end: string | Date;
    doctorUID: string;
  }) {
    const { start, end, doctorUID } = range;
    const rangeStart = DateTime.fromISO(`${start}T00:00:00`).setZone("utc").toFormat('yyyy-LL-dd HH:mm:ss');
    const rangeEnd = DateTime.fromISO(`${end}T23:30:00`).setZone("utc").toFormat('yyyy-LL-dd HH:mm:ss');

    const apptTickets: AppointmentTicket[] = [];
    const result = await HTTP().get('/appointment-tickets' , { params: { rangeStart, rangeEnd, doctorId: doctorUID }});
    const DATA : Array<any> = result.data.data;
    DATA.forEach((item) => {
      // doc.data() is never undefined for query doc snapshots
      const { id, startTime, endTime, cost, isFree, doctorId } = item;

      const record: AppointmentTicket = {
        id: id,
        name: isFree ? "GRATIS" : `DE PAGO (S./${cost.toFixed(2)})`,
        start: DateTime.fromISO(startTime).toFormat("yyyy-LL-dd HH:mm"),
        end: DateTime.fromISO(endTime).toFormat("yyyy-LL-dd HH:mm"),
        startTime,
        endTime,
        color: isFree ? "green" : "blue",
        cost,
        isFree,
        doctorId
      };
      apptTickets.push(record);
    });

    /* this.SET_CURRENTAPPTTICKETSRANGE(apptTickets); */
    return apptTickets;
  }

  @Action
  async saveNewApptTickets(data: {
    start: any;
    end: any;
    isFree: boolean;
    cost: number;
    doctorId: string;
  }) {
    const { start, end, isFree, cost, doctorId } = data;
    const utcStart = start.setZone("utc");
    const utcEnd = end.setZone("utc");

    const diffInMinutes = utcEnd.diff(utcStart, "minutes");

    const numTickets = diffInMinutes.toObject().minutes / 30;
    const apptTickets = [];
    for (let i = 0; i < numTickets; i++) {
      apptTickets.push({
        startTime: utcStart.plus({ minutes: i * 30 }).toFormat('yyyy-LL-dd HH:mm:ss'),
        endTime:  utcStart.plus({ minutes: i * 30 + 29 }).toFormat('yyyy-LL-dd HH:mm:ss'),
        cost,
        isFree: isFree ? 1 : 0,
        doctorId,
        recordStatus: 'A'
      });
    }
    await HTTP().post('/appointment-tickets', apptTickets );
  }

  @Action
  async getAppointmentTicketsByDoctorId(doctorId: string): Promise<any> {
    const rangeStart = DateTime.now().plus({ hours: 1 }).setZone("utc").toFormat('yyyy-LL-dd HH:mm:ss');

    const apptTickets: any = {};
    const { data } = await HTTP().get('/appointment-tickets' , { params: { rangeStart, doctorId }});
    const DATA : Array<any> = data.data;
    DATA.forEach((item) => {
      // doc.data() is never undefined for query doc snapshots
      const { startTime } = item;
      const key: string = DateTime.fromISO(startTime).toFormat("yyyy-LL-dd");
      if( !apptTickets[key] ){
        apptTickets[key] = [];
      }
      apptTickets[key].push(item)
 
    });
    return apptTickets;
  }
}

export default getModule(AppointmentsStore);
