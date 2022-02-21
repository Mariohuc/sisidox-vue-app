import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import { AppointmentTicket, AppStatus, MercadoPagoPayload } from "../models";
import store from "@/store";
import HTTP from "@/http";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "appointmentsStore"
})
class BookedAppointmentsStore extends VuexModule {
  public currentApptTicketsRange: AppointmentTicket[] = [];
  /* An @Action only can receive one argument */
  public SCHEDULED_STATUS: AppStatus = {
    label: "PROGRAMADA",
    color: "amber accent-4"
  };
  public ONGOING_STATUS: AppStatus = {
    label: "EN_CURSO",
    color: "green accent-4"
  };
  public FINISHED_STATUS: AppStatus = {
    label: "FINALIZADA",
    color: "red accent-4"
  };

  @Mutation
  SET_CURRENTAPPTTICKETSRANGE(val: AppointmentTicket[]) {
    this.currentApptTicketsRange = val;
  }

  @Action
  async createBookedAppointment(allData: {
    mercadoPagoData?: MercadoPagoPayload,
    mpSellerCredentialId?: string,
    appointmentData: {
      apptTicketId: number,
      patientId: string,
      doctorId: string,
      previousPatientComments: string,
      isFree: boolean | number,
      cost: number
  }}): Promise<any> {
    
    const { data } = await HTTP().post("/booked-appointments", allData);
    return data;
  }
}

export default getModule(BookedAppointmentsStore);
