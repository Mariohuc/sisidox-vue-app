import {
  VuexModule,
  Module,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import { DateTime } from "luxon";
import HTTP from "@/http";
import HTTP_PUBLIC from "@/public-http";
import { DoctorCreationTicket } from "../models";

config.rawError = true;


@Module({
  dynamic: true,
  store,
  name: "DoctorCreationTicketsStore"
})
class DoctorCreationTicketsStore extends VuexModule {
  
  @Action
  async getById(dcTicketId: string): Promise<DoctorCreationTicket> {
    const { data }: any = await HTTP_PUBLIC().get('/doctor-creation-tickets/' + dcTicketId)
    return data.data;
  }

  @Action
  async createTicket(formData: {
    documentType: string;
    documentNumber: string;
  }):  Promise<{ dcTicketId: string }> {
    const { data }: any = await HTTP().post('/doctor-creation-tickets', formData)
    return data.data[0];
  }

  @Action
  async deleteTicket(dcTicketId: string): Promise<void> {
    await HTTP().delete('/doctor-creation-tickets/' + dcTicketId)
  }

}

export default getModule(DoctorCreationTicketsStore);