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
    gender: "",
    appointmentCost: 0,
    formalPhotoUrl: "",
    personalDescription: "",
    createdAt: "",
    updatedAt: "",
    recordStatus: "",
  };
  public doctorExists = false;

  @Action
  async saveOrUpdateDoctorData(doctor: DoctorData): Promise<void> {
    if( this.doctorExists ){
      await HTTP().patch('/doctor-data/' + doctor.doctorId, doctor);
    }else{
      await HTTP().post('/doctor-data', doctor);
    }
    //this.SET_DOCTOREXISTS(true);
  }

  @Action
  async getDoctorData(doctorId: string): Promise<void>  {
    const { data } = await HTTP().get('/doctor-data/' + doctorId);
    const doctorData = data.data as DoctorData;
    if (doctorData) {
      this.SET_DOCTORDATA(doctorData);
      this.SET_DOCTOREXISTS(true);
      this.getDoctorPhotoUrl(doctorId)
    }else{
      this.SET_DOCTOREXISTS(false);
    }
  }

  @Action
  async getDoctorPhotoUrl(doctorId: string): Promise<void> {
    const { data } = await HTTP().get('/doctor-data/' + doctorId + '/photo-url');
    const result: { doctorId: string, photoUrl: string } = data.data;
    if( result ){
      this.SET_FORMAL_PHOTO_URL(result.photoUrl || "")
    }
  }

  @Mutation
  SET_DOCTORDATA(doctorData: DoctorData): void {
    this.doctorData.doctorId = doctorData.doctorId;
    this.doctorData.fullname = doctorData.fullname;
    this.doctorData.specialty = doctorData.specialty;
    this.doctorData.cmpNumber = doctorData.cmpNumber;
    this.doctorData.gender = doctorData.gender;
    this.doctorData.appointmentCost = doctorData.appointmentCost;
    this.doctorData.personalDescription = doctorData.personalDescription;
    this.doctorData.createdAt = doctorData.createdAt;
    this.doctorData.updatedAt = doctorData.updatedAt;
    this.doctorData.recordStatus = doctorData.recordStatus;
  }
  @Mutation
  SET_FORMAL_PHOTO_URL(photoUrl: string): void{
    this.doctorData.formalPhotoUrl = photoUrl;
  }

  @Mutation
  SET_DOCTOREXISTS(val: boolean): void{
    this.doctorExists = val;
  }
}

export default getModule(DoctorDataStore);
