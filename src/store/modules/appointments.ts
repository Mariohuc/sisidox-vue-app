import {
  VuexModule,
  Module,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import { AppointmentsRange } from "../models";
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
  public appointmentsRange: AppointmentsRange[] = [];
  /* An @Action only can receive one argument */
  @Action
  async fetchAppointmentsByRange( range: { start: string | Date, end: string | Date }) {
    const { start, end } = range;
    const querySnapshot = await firebase
      .firestore()
      .collection("appointments")
      .where(
        "startTime",
        ">=",
        firebase.firestore.Timestamp.fromMillis(
          DateTime.fromISO(`${start}T00:00:00`).setZone('utc').toMillis()
        )
      )
      .where(
        "startTime",
        "<=",
        firebase.firestore.Timestamp.fromMillis(
          DateTime.fromISO(`${end}T23:30:00`).setZone('utc').toMillis()
        )
      )
      .get();

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      const { startTime, endTime } = doc.data()
      console.log( startTime.toDate(), endTime.toDate() )
    });
  }

  @Action
  emptyApptsRangeArray() {
    this.appointmentsRange.length = 0;
  }
}

export default getModule(AppointmentsStore);
