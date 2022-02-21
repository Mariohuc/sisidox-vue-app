import {
  VuexModule,
  Module,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import HTTP from "@/http";
import { MpSellerCredential } from "../models";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "MpSellerCredentialsStore"
})
class MpSellerCredentialsStore extends VuexModule {
  
  @Action
  async getAll(params: { userId?: string, recordStatus?: string }): Promise<Array<MpSellerCredential>> {
    const { data }: any = await HTTP().get('/mp-seller-credentials', { params })
    return data.data;
  }

  @Action
  async create(payload: {
    userId: string;
    accessToken: string;
    refreshToken: string;
    publicKey: string;
    recordStatus: 'A' | 'I' | '*';
  }):  Promise<any> {
    const { data }: any = await HTTP().post('/mp-seller-credentials', payload)
    return data.data;
  }
  // *** An action method can only receive one parameter at most ***
  @Action
  async update(allData: { mpSellerCredentialId: string, payload: {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    publicKey?: string;
    recordStatus?: 'A' | 'I' | '*';
  }}): Promise<any> {
    const { data }: any = await HTTP().patch('/mp-seller-credentials/' + allData.mpSellerCredentialId, allData.payload)
    return data.data;
  }

}

export default getModule(MpSellerCredentialsStore);