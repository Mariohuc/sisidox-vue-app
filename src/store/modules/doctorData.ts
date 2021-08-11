import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation,
} from "vuex-module-decorators";
import { DoctorData } from "@/store/models";
import store from "@/store";
import HTTP from "@/http";

config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "doctorDataStore",
})
class DoctorDataStore extends VuexModule {
  public doctorData: DoctorData = {
    doctorId: "",
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
  public doctorExists = false;

  @Action
  async saveOrUpdateDoctorData(doctor: DoctorData) {
    if( this.doctorExists ){
      await HTTP().patch('/doctor-data', doctor);
    }else{
      await HTTP().post('/doctor-data', doctor);
    }
    this.SET_DOCTOREXISTS(true);
  }

  @Action
  async getDoctorData(doctorId: string) {
    const { data } = await HTTP().get('/doctor-data/' + doctorId);
    const doctorData = data.data as DoctorData;
    if (doctorData) {
      this.SET_DOCTORDATA(doctorData);
      this.SET_DOCTOREXISTS(true);
    }else{
      this.SET_DOCTOREXISTS(false);
    }
  }

  @Mutation
  SET_DOCTORDATA(doctorData: DoctorData) {
    this.doctorData.doctorId = doctorData.doctorId;
    this.doctorData.fullname = doctorData.fullname;
    this.doctorData.specialty = doctorData.specialty;
    this.doctorData.cmpNumber = doctorData.cmpNumber;
    this.doctorData.appointmentCost = doctorData.appointmentCost;
    //this.doctorData.formalPhotoUrl = doctorData.formalPhotoUrl;
    this.doctorData.personalDescription = doctorData.personalDescription;
    this.doctorData.createdAt = doctorData.createdAt;
    this.doctorData.updatedAt = doctorData.updatedAt;
    this.doctorData.recordStatus = doctorData.recordStatus;
  }

  @Mutation
  SET_DOCTOREXISTS(val: boolean){
    this.doctorExists = val;
  }
}

export default getModule(DoctorDataStore);
