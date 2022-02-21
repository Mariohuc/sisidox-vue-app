import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import HTTP from "@/http";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "MercadoPagoGatewayStore"
})
class MercadoPagoUsersStore extends VuexModule {
  
  @Action
  async renewSellerCredentials(payload: { mpSellerCredentialId: string, refreshToken: string }): Promise<{ message: string, rows: number }> {
    const { data }: any = await HTTP().post('/renew-seller-credentials', payload)
    return data.data;
  }

}

export default getModule(MercadoPagoUsersStore);
