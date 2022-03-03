import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { DateTime } from "luxon";
import HTTP from "@/http";
import PUBLIC_HTTP from "@/public-http";

config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "basicReportsStore"
})
class BasicReportsStore extends VuexModule {
  
  @Action
  async getDoctorAppointments(params: {
    page?: number;
    limit?: number;
    doctorId?: string;
    patient?: string;
    recordStatus?: string;
  }) {
    const { data }: any = await HTTP().get('/doctor-appointments', { params: params })
    return data.data;
  }

  @Action
  async getPatientAppointments(params: {
    page?: number;
    limit?: number;
    patientId?: string;
    doctor?: string;
    apptStatus?: string;
    recordStatus?: string;
  }) {
    const { data }: any = await HTTP().get('/patient-appointments', { params: params })
    return data.data;
  }

  @Action
  async getDoctorsSummary(params: {
    page?: number;
    limit?: number;
    doctorId?: string;
    specialty?: string;
    doctorName?: string;
    recordStatus?: string;
  }) {
    const { data }: any = await PUBLIC_HTTP().get('/doctors-summary', { params: params })
    return data.data;
  }

  @Action
  async getDoctorPatients(params: {
    page?: number;
    limit?: number;
    doctorId?: string;
    recordStatus?: string;
  }) {
    const { data }: any = await HTTP().get('/doctor-patients', { params: params })
    return data.data;
  }
}

export default getModule(BasicReportsStore);
