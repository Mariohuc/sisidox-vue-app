<template>
  <v-card>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1">
        Selecciona un turno
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card class="mb-4">
          <v-card-actions class="justify-center">
            <v-pagination
              v-model="page"
              :length="totalPages"
              @change="() => console.log('Changed in shifts page')"
            ></v-pagination>
          </v-card-actions>
          <v-card-text>
            <template v-if="paginatedDatekeys.length > 0">
              <v-row>
                <v-col
                  :cols="colsPerPageItems"
                  v-for="(date, i) in paginatedDatekeys"
                  :key="i"
                  class="py-0"
                >
                  <div class="d-flex flex-column text-center">
                    <strong v-text="getFormatedWeekDay(date)"></strong>
                    <strong v-text="getFormatedDate(date)"></strong>
                  </div>
                </v-col>
              </v-row>
              <v-row class="pt-0 mb-2 scroll-content">
                <v-col
                  :cols="colsPerPageItems"
                  v-for="(date, i) in paginatedDatekeys"
                  :key="i"
                >
                  <div
                    v-for="(item, k) in appointmentTickets[date]"
                    :key="k"
                    class="d-flex flex-column text-center"
                  >
                    <v-badge
                      bordered
                      :color="item.isFree ? 'success' : 'primary'"
                      :content="item.isFree ? 'G' : 'P'"
                      overlap
                    >
                      <v-btn
                        block
                        v-text="getShift(item.startTime)"
                        class="my-1"
                        :disabled="!item.isFree && !isAvailableToCharge"
                        @click="chooseShift(item)"
                      ></v-btn>
                    </v-badge>
                  </div>
                </v-col>
              </v-row>
            </template>

            <template v-else>
              <v-row justify="center">
                <v-col cols="12" md="6" class="d-flex justify-center">
                  <span class="text-h6">No hay citas para mostrar</span>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">
        <span class="d-flex flex-row align-center"
          >Escribe un comentario
          <v-tooltip v-model="show01" top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon color="grey lighten-1"> mdi-help-circle </v-icon>
              </v-btn>
            </template>
            <span
              >Tu médico podra conocer más de tu problema previo a la
              consulta</span
            >
          </v-tooltip>
        </span>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="mb-4">
          <v-textarea
            filled
            label="Estos comentarios solo los verá tu médico"
            auto-grow
            v-model="previousPatientComments"
            :counter="200"
          ></v-textarea>
        </v-card>
        <v-btn color="primary" v-if="!checkIfApptIsFree()" @click="step = 3">
          Continuar
        </v-btn>
        <v-btn color="primary" v-else @click="step = 4"> Continuar </v-btn>
        <v-btn text @click="step = 1"> Atrás </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3">
        Método de pago
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card class="mb-4">
          <v-card-text>
            <v-form ref="mpForm" v-model="mpFormValid">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="mpFormData.cardNumber" v-mask="'#### #### #### ####'" label="Número de tarjeta" name="cardNumber" dense :rules="[(v) => !!v || 'Este campo es requerido']"></v-text-field>
                  
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="mpFormData.cardExpirationDate" v-mask="'##/##'" label="Fecha de vencimiento" name="cardExpirationDate" dense :rules="[(v) => !!v || 'Este campo es requerido']"></v-text-field>
                  
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="mpFormData.cardholderName" label="Titular de la tarjeta" name="cardholderName" dense :rules="[(v) => !!v || 'Este campo es requerido']"></v-text-field>
                  
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="mpFormData.cardholderEmail" label="E-mail" type="email" name="cardholderEmail" dense :rules="[(v) => !!v || 'Este campo es requerido']"></v-text-field>
                  
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="mpFormData.securityCode" label="Código de seguridad" name="securityCode" dense :rules="[(v) => !!v || 'Este campo es requerido']"></v-text-field>                
                </v-col>
                                                                   
              </v-row>   
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex flex-row-reverse">
            By visa <v-img class="mr-1" src="img/visa-logo.png" max-width="30px" />
          </v-card-actions>
        </v-card>
        <v-btn color="primary" :disabled="!mpFormValid" @click="step = 4"> Continuar </v-btn>      
        <v-btn text @click="step = 2"> Atrás </v-btn>
      </v-stepper-content>

      <v-stepper-step step="4" :complete="mainFormFinished"> Resúmen </v-stepper-step>
      <v-stepper-content step="4">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="mb-4" v-if="!!selectedTicket">
              <v-card-text>
                <v-text-field
                  label="Doctor"
                  readonly
                  :value="doctor.fullname"
                >
                  <template v-slot:prepend>
                    <v-avatar size="36">
                      <img
                        :src="doctor.photoUrl || 'img/generic/doctor-default.png'"
                        alt="John"
                      />
                    </v-avatar>
                  </template>
                </v-text-field>
                <v-text-field
                  label="Comienza a las:"
                  :value="getFormatedFullDate(selectedTicket.startTime)"
                  readonly
                >
                  <template v-slot:prepend>
                    <v-avatar size="36">
                      <img
                        src="/img/clock.png"
                        alt="Clock"
                      />
                    </v-avatar>
                  </template>
                </v-text-field>

                <v-text-field
                  label="Costo total"
                  prefix="S/."
                  :value="Number.parseFloat(selectedTicket.cost).toFixed(2)"
                  readonly
                >
                  <template v-slot:prepend>
                    <v-avatar size="36">
                      <img
                        src="/img/tag.png"
                        alt="Clock"
                      />
                    </v-avatar>
                  </template>
                </v-text-field>

                <v-text-field
                  label="Especialidad"
                  :value="doctor.specialtyName"
                  readonly
                >
                  <template v-slot:prepend>
                    <v-avatar size="36">
                      <img
                        src="/img/stethoscope.png"
                        alt="Clock"
                      />
                    </v-avatar>
                  </template>
                </v-text-field>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div v-if="!mainFormFinished" class="d-flex justify-center">
          <v-btn v-if="successfulLogin" rounded outlined color="primary" @click="bookAppointmentWithSnackbar(true)" :loading="bookBtnLoading"> Reservar </v-btn>
          <login v-if="!successfulLogin" :btnCustomText="'Reservar'" :showLogout="false" @successfulLoginEvent="bookAppointmentWithSnackbar($event)"></login>
          <v-btn v-if="checkIfApptIsFree()" text @click="step = 2">
            Atrás
          </v-btn>
          <v-btn v-else text @click="step = 3"> Atrás </v-btn>
        </div>
      </v-stepper-content>
    </v-stepper>

    <GeneralSnackBar 
      :snackbar="snackBarParams.snackbar" 
      :color="snackBarParams.color" 
      :text="snackBarParams.text" 
      :timeout="snackBarParams.timeout"
      @changeStatus="updateSnackBarStatus($event)"/>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AuthStore from "@/store/modules/auth";
import AppointmentsStore from "@/store/modules/appointments";
import BookedAppointmentsStore from "@/store/modules/bookedAppointments";
import MercadoPagoGatewayStore from "@/store/modules/mercadoPagoGateway";
import MpSellerCredentialsStore from "@/store/modules/mpSellerCredentials";
import { paginator } from "@/utilities/paginator";
import { DateTime } from "luxon";
import { AppointmentTicket, DoctorSum, MpSellerCredential, SnackBarParams } from "@/store/models";

import GeneralSnackBar from "@/components/general/GeneralSnackBar.vue"
import { getSnackBarErrorParams } from "@/general-utils";
import login from "@/components/Login.vue"

@Component({
  name: "ApptTicketsForBooking",
  components: {
    GeneralSnackBar,
    login
  }
})
export default class ApptTicketsForBooking extends Vue {
  appointmentTickets: any = null;
  allDateKeys: string[] = [];
  paginatedDatekeys: string[] = [];

  page = 1;
  perPageItems = 4;
  totalPages = 1;

  step = 1;
  selectedTicket: AppointmentTicket | null = null;
  previousPatientComments = ""

  show01 = false;
  snackBarParams: SnackBarParams = { snackbar: false, color: 'success', text: '' }
  @Prop({ required: true }) doctor!: DoctorSum;
  
  mainFormFinished = false
  bookBtnLoading = false

  $refs!: {
    mpForm: any;
  };

  mpFormValid = false
  mpFormData: any = {
    cardNumber: '',
    cardholderName: '',
    cardExpirationDate: '',
    securityCode: '',
    cardholderEmail: ''
  }

  mpSellerCredential?: MpSellerCredential
  isAvailableToCharge = false
  successfulLogin = false
  created(): void {
    this.getMpSellerCredential(this.doctor.doctorId);
    this.getAppointmentTickets(this.doctor.doctorId);
    this.initParams();
  }

  get colsPerPageItems(): number {
    return parseInt(String(12 / this.perPageItems), 10);
  }
  get isLoggedIn(): boolean {
    return !!AuthStore.uid;
  }
  initParams(): void{
    this.successfulLogin = AuthStore.uid ? true : false
  }
  async getMpSellerCredential(doctorId: string): Promise<void> {
    const [record]: Array<MpSellerCredential> = await MpSellerCredentialsStore.getAll({ userId: doctorId });
    if( record ){
      this.mpSellerCredential = record;

      const date: string = this.mpSellerCredential.updatedAt ? this.mpSellerCredential.updatedAt : this.mpSellerCredential.createdAt;
      const toCompare: any = DateTime.fromISO(date).plus({ days: 170 });

      if( DateTime.now() < toCompare ){
        this.isAvailableToCharge = true;
        MercadoPagoGatewayStore.initMercadoPago(this.mpSellerCredential.publicKey);
        console.log('Mercado Pago Re-init')
      }      
    }
  }

  async getAppointmentTickets(doctorId: string): Promise<void> {
    const data: any = await AppointmentsStore.getAppointmentTicketsByDoctorId(
      doctorId
    );
    this.appointmentTickets = data;
    this.allDateKeys = Object.keys(this.appointmentTickets);

    const result = paginator(this.allDateKeys, this.page, this.perPageItems);
    this.totalPages = result.total_pages;
    this.paginatedDatekeys = result.data;
  }
  getFormatedWeekDay(date: string): string {
    return DateTime.fromISO(date).setLocale("es").toFormat("cccc");
  }
  getFormatedDate(date: string): string {
    return DateTime.fromISO(date).setLocale("es").toFormat("dd LLLL");
  }
  getFormatedFullDate(datetime: string): string {
    return DateTime.fromISO(datetime)
      .setLocale("es")
      .toFormat(`dd LLLL yyyy',' hh:mm a`);
  }
  getShift(time: string): string {
    return DateTime.fromISO(time).toFormat("hh:mm a");
  }
  chooseShift(item: AppointmentTicket): void {
    console.log(item);
    this.selectedTicket = item;
    
    this.step = 2;
  }
  checkIfApptIsFree(): boolean {
    if (!this.selectedTicket) return false;
    return this.selectedTicket.isFree;
  }
  async bookAppointmentWithSnackbar(isLoggedIn: boolean): Promise<void> {
    this.successfulLogin = isLoggedIn;
    
    if( !isLoggedIn ){
      this.snackBarParams = { snackbar: true, color: 'error', text: 'Debe iniciar sesión para poder reservar una cita!' };
    }else{
      this.snackBarParams = await this.bookAppointment();
    }
  }
  async bookAppointment(): Promise<SnackBarParams>{
    try {
      this.bookBtnLoading = true;
      
      if( AuthStore.uid === this.doctor.doctorId ){
        return { snackbar: true, color: 'warning', text: 'Debe ingresar con otra cuenta para reservar su cita!' }
      }

      let mercadoPagoData: any = undefined;
      let mpSellerCredentialId: string | undefined;
      if( this.selectedTicket && !this.selectedTicket.isFree ){
        const dateArray = this.mpFormData.cardExpirationDate.split('/');
        mercadoPagoData = await MercadoPagoGatewayStore.createMercadoPagoPayload({ cardData: { 
          cardNumber: this.mpFormData.cardNumber.replace(/\s+/g, ''),
          cardholderName: this.mpFormData.cardholderName,
          cardExpirationMonth: dateArray[0],
          cardExpirationYear: dateArray[1],
          securityCode: this.mpFormData.securityCode }, additionalData: { amount: this.selectedTicket.cost, cardholderEmail: this.mpFormData.cardholderEmail, specialty: this.doctor.specialtyName } })
        mpSellerCredentialId = this.mpSellerCredential?.id;
      }

      const appointmentData: any = this.getDataToSave();
    
      const response: any = await BookedAppointmentsStore.createBookedAppointment({ appointmentData, mpSellerCredentialId, mercadoPagoData });
      this.mainFormFinished = true
      return { snackbar: true, color: 'success', text: response.message, timeout: 15000 }
    } catch (error) {
      console.log(error)
      return getSnackBarErrorParams(error)
    }finally{
      this.bookBtnLoading = false;
    }    
  }
  updateSnackBarStatus(val: boolean){
    this.snackBarParams.snackbar = val;
  }
  getDataToSave(): any {
    return {
      apptTicketId: this.selectedTicket?.id,
      patientId: AuthStore.uid,
      doctorId: this.doctor.doctorId,
      previousPatientComments: this.previousPatientComments,
      isFree: this.selectedTicket?.isFree,
      cost: this.selectedTicket?.cost,
    }
  }

  async signInWithGoogle(): Promise<boolean> {
    try {
      await AuthStore.signInWithGoogle();
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
</script>

<style scoped>
.main-content {
  display: flex !important;
  flex-direction: column;
}

.scroll-content {
  height: 250px;
  overflow-y: scroll;
}
</style>