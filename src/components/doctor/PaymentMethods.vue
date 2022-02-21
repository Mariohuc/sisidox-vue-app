<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab :href="'#mercado-pago'"> Mercado Pago </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item :value="'mercado-pago'">
        <v-card flat>
          <v-card-text class="text-center">
            <v-alert v-if="statusAlert.visible" outlined :type="statusAlert.type" text>
              {{ statusAlert.text }}
            </v-alert>
            <v-btn
              color="primary"
              class="my-4"
              v-if="newCredentiaslBtnStatus"
              @click="openMPauthorizationPage()"
              >Obtener nuevas credenciales</v-btn
            >
            <v-btn
              color="primary"
              class="my-4"
              v-else
              @click="nenewMyCredentials()"
              :loading="reneCredBtnLoading"
              >Renovar credenciales</v-btn
            >
            
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <GeneralSnackBar 
      :snackbar="snackBarParams.snackbar" 
      :color="snackBarParams.color" 
      :text="snackBarParams.text" 
      :timeout="snackBarParams.timeout"
      @changeStatus="updateSnackBarStatus($event)"/>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import GlobalsStore from "@/store/modules/globals";
import { AlertParams, MpSellerCredential, SnackBarParams } from "@/store/models";
import MpSellerCredentialsStore from "@/store/modules/mpSellerCredentials";
import MercadoPagoUsersStore from "@/store/modules/mercadoPagoUsers"
import { DateTime } from "luxon";
import { getSnackBarErrorParams } from "@/general-utils";
import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue"

@Component({
  name: "PaymentMethods",
  components: { GeneralSnackBar }
})
export default class PaymentMethods extends Vue {
  tab = null;

  mpSellerCredential?: MpSellerCredential;
  expiredCredential = false;

  statusAlert: AlertParams = { visible: false, text: '', type: 'success' }

  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '' }

  reneCredBtnLoading = false

  get newCredentiaslBtnStatus(): boolean {
    return this.expiredCredential || !this.mpSellerCredential
  }
  created(): void {
    this.getMpSellerCredential(AuthStore.uid);
  }

  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }

  openMPauthorizationPage(): void {
    const state = `${Date.now()}-${AuthStore.uid}`;
    const url = `https://auth.mercadopago.com.pe/authorization?client_id=${process.env.VUE_APP_MP_APP_ID}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${process.env.VUE_APP_MP_APP_REDIRECT_URI}`;
    GlobalsStore.NativeWindow.open(url, "_blank");
  }

  async getMpSellerCredential(doctorId: string): Promise<void> {
    const [record]: Array<MpSellerCredential> =
      await MpSellerCredentialsStore.getAll({ userId: doctorId });
    if (record) {
      this.mpSellerCredential = record;

      const date: string = this.mpSellerCredential.updatedAt
        ? this.mpSellerCredential.updatedAt
        : this.mpSellerCredential.createdAt;
      const toCompare: any = DateTime.fromISO(date).plus({ days: 170 });

      this.statusAlert.visible = true;

      if (toCompare <= DateTime.now()) {
        this.expiredCredential = true;
        this.statusAlert.type = 'warning';
        this.statusAlert.text = `Sus credenciales vencieron el ${toCompare.toLocaleString(DateTime.DATE_FULL)}. Por favor obtenga unas nuevas dando click en el botón`
      }else{
        this.expiredCredential = false;
        this.statusAlert.type = 'info';
        this.statusAlert.text = `Sus credenciales vencerán el ${toCompare.toLocaleString(DateTime.DATE_FULL)}. Puede renovarlas dando click en el botón`
      }
    }
  }

  async nenewMyCredentials(): Promise<void> {
    this.snackBarParams = await this._nenewMyCredentials();
  }

  async _nenewMyCredentials(): Promise<SnackBarParams> {
    this.reneCredBtnLoading = true;
    try {
      if(!this.mpSellerCredential) return { snackbar: true, color: 'error', text: 'Usted no dispone credenciales!', timeout: 10000 }
      
      await MercadoPagoUsersStore.renewSellerCredentials({ mpSellerCredentialId: this.mpSellerCredential.id, refreshToken: this.mpSellerCredential.refreshToken })
      this.getMpSellerCredential(AuthStore.uid) // reload credentials
      return { snackbar: true, color: 'success', text: 'Renovación completada!', timeout: 10000 }
    } catch (error) {
      return getSnackBarErrorParams(error)
    } finally {
      this.reneCredBtnLoading = false;
    }
  }

}
</script>