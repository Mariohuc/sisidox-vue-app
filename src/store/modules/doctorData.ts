import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import { DoctorData } from "@/store/models"
import store from "@/store";
import firebase from "firebase";
import { DateTime } from "luxon";

config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "doctorDataStore"
})
class DoctorDataStore extends VuexModule {

  @Action
  async saveOrUpdateDoctorData( doctor: DoctorData ) {
    const uid = doctor.uid;
    delete doctor.uid;
    await firebase
      .firestore()
      .collection("doctorData")
      .doc(uid)
      .set(doctor, { merge: true });
  }
}

export default getModule(DoctorDataStore);
