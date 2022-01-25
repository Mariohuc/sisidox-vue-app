import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";

config.rawError = true;
declare const MercadoPago: any;

interface DefaultConfigs {
  installments: number;
  paymentMethodId: string;
}

interface MercadoPagoPayload {
  token: string;
  issuer_id?: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  description: string;
  payer: { email: string; identification?: { type: string; number: string } };
}

@Module({
  dynamic: true,
  store,
  name: "MercadoPagoGatewayStore"
})
class MercadoPagoGatewayStore extends VuexModule {
  public mercadoPago: any = new MercadoPago(process.env.VUE_APP_MP_PUBLIC_KEY);

  public defaultConfigs: DefaultConfigs = {
    installments: 1,
    paymentMethodId: "visa"
  };

  get MercadoPago(): any {
    return this.mercadoPago;
  }

  get DefaultConfigs(): DefaultConfigs {
    return this.defaultConfigs;
  }

  @Action
  async createMercadoPagoPayload(allData: {
    cardData: {
      cardNumber: string;
      cardholderName: string;
      cardExpirationMonth: string;
      cardExpirationYear: string;
      securityCode: string;
    };
    additionalData: {
      amount: number;
      cardholderEmail: string;
      specialty?: string;
    };
  }): Promise<MercadoPagoPayload> {
    
    /**
     * Example cardData
     * cardNumber: '4009175332806176',
       cardholderName: 'APRO',
       cardExpirationMonth: '11',
       cardExpirationYear: '25',
       securityCode: '123'
     */
    console.log(allData)
    const cardToken: { id: string } = await this.MercadoPago.createCardToken(allData.cardData);

    return {
      token: cardToken.id,
      payment_method_id: this.DefaultConfigs.paymentMethodId,
      transaction_amount: allData.additionalData.amount,
      installments: this.DefaultConfigs.installments,
      description: allData.additionalData.specialty ? "Cita para: " + allData.additionalData.specialty : "Cita General",
      payer: {
        email: allData.additionalData.cardholderEmail
      }
    };
  }
}

export default getModule(MercadoPagoGatewayStore);
