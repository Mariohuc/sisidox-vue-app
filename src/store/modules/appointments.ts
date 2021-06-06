import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import {
  AppointmentsRange,
  AppointmentTicket,
  AppointmentTicketRange
} from "../models";
import store from "@/store";
import firebase from "firebase";
import { DateTime } from "luxon";

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
  @Mutation
  SET_CURRENTAPPTTICKETSRANGE(val: AppointmentTicket[]) {
    this.currentApptTicketsRange = val;
  }

  @Action
  async fetchApptTicketsByRange(range: {
    start: string | Date;
    end: string | Date;
    doctorUID: string;
  }) {
    const { start, end, doctorUID } = range;

    const querySnapshot = await firebase
      .firestore()
      .collection("appointmentTickets")
      .where("doctorId", "==", doctorUID)
      .where(
        "startTime",
        ">=",
        firebase.firestore.Timestamp.fromMillis(
          DateTime.fromISO(`${start}T00:00:00`).setZone("utc").toMillis()
        )
      )
      .where(
        "startTime",
        "<=",
        firebase.firestore.Timestamp.fromMillis(
          DateTime.fromISO(`${end}T23:30:00`).setZone("utc").toMillis()
        )
      )
      .get();
    const apptTickets: AppointmentTicket[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const { startTime, endTime, cost, isFree, doctorId } = doc.data();

      const record: AppointmentTicket = {
        uid: doc.id,
        name: isFree ? "GRATIS" : `DE PAGO (S./${cost.toFixed(2)})`,
        start: DateTime.fromJSDate(startTime.toDate()).toFormat(
          "yyyy-LL-dd HH:mm"
        ),
        end: DateTime.fromJSDate(endTime.toDate()).toFormat("yyyy-LL-dd HH:mm"),
        color: isFree ? "green" : "blue",
        cost,
        isFree,
        doctorId
      };
      apptTickets.push(record);
    });
   
    this.SET_CURRENTAPPTTICKETSRANGE(apptTickets);
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
    const db = firebase.firestore();
    const batch = db.batch();
    for (let i = 0; i < numTickets; i++) {
      batch.set(db.collection("appointmentTickets").doc(), {
        startTime: firebase.firestore.Timestamp.fromMillis(
          utcStart.plus({ minutes: i * 30 }).toMillis()
        ),
        endTime: firebase.firestore.Timestamp.fromMillis(
          utcStart.plus({ minutes: i * 30 + 29 }).toMillis()
        ),
        cost,
        isFree,
        doctorId
      });
    }
    await batch.commit();
  }

}

export default getModule(AppointmentsStore);
