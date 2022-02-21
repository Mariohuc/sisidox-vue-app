import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { MercadoPagoPayload } from "../models";
import { GeneralError } from "@/utilities/generalError";

config.rawError = true;
declare const MercadoPago: any;

interface DefaultConfigs {
  installments: number;
  paymentMethodId: string;
}

@Module({
  dynamic: true,
  store,
  name: "MercadoPagoGatewayStore"
})
class MercadoPagoGatewayStore extends VuexModule {
  public mercadoPago: any;

  public defaultConfigs: DefaultConfigs = {
    installments: 1,
    paymentMethodId: "visa"
  };

  @Mutation
  SET_MERCADO_PAGO_INSTANCE(val: any): void {
    this.mercadoPago = val;
  }

  get MercadoPago(): any {
    return this.mercadoPago;
  }

  get DefaultConfigs(): DefaultConfigs {
    return this.defaultConfigs;
  }

  @Action
  initMercadoPago(publicKey: string): void {
    const mp: any = new MercadoPago(publicKey);
    this.SET_MERCADO_PAGO_INSTANCE(mp);
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
    try {
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
    } catch (error) {
      throw new GeneralError('Error al procesar la tarjeta, por favor revise sus datos')
    }
    
  }
}

export default getModule(MercadoPagoGatewayStore);
