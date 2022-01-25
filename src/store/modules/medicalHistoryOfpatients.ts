import {
  VuexModule,
  Module,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import HTTP from "@/http";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "MedicalHistoryOfpatientsStore"
})
class MedicalHistoryOfpatientsStore extends VuexModule {
  
  @Action
  async getAllHistories(params: { userId?: string, recordStatus?: string }): Promise<Array<{ userId: string, allergies: Array<{name: string}>, diseases: Array<{name: string}>, recordStatus: string }>> {
    const { data }: any = await HTTP().get('/medical-history-of-patients', { params })
    return data.data;
  }

  @Action
  async createHistory(payload: {
    userId: string,
    allergies?: Array<{name: string}>,
    diseases?: Array<{name: string}>,
    recordStatus?: string
  }):  Promise<any> {
    const { data }: any = await HTTP().post('/medical-history-of-patients', payload)
    return data.data;
  }
  // *** An action method can only receive one parameter at most ***
  @Action
  async updateHistory(allData: { userId: string, payload: {
    allergies?: Array<{name: string}>,
    diseases?: Array<{name: string}>,
    recordStatus?: string
  }}): Promise<any> {
    const { data }: any = await HTTP().patch('/medical-history-of-patients/' + allData.userId, allData.payload)
    return data.data;
  }

}

export default getModule(MedicalHistoryOfpatientsStore);