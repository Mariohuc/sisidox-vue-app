import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import {
  AppointmentTicket, AppStatus
} from "../models";
import store from "@/store";
import firebase from "firebase";
import { DateTime } from "luxon";
import HTTP from "@/http";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "DoctorSearchFiltersStore"
})
class DoctorSearchFiltersStore extends VuexModule {
  public specialty: { codeword: string, name: string } = { codeword: "", name: "" };
  public doctorId = ''
  public searchWords = ''

  @Mutation
  SET_SPECIALTY(val: { codeword: string, name: string }): void {
    this.specialty.codeword = val.codeword;
    this.specialty.name = val.name
  }

  @Mutation
  SET_DOCTORID(val: string): void {
    this.doctorId = val
  }

  @Mutation
  SET_SEARCHWORDS(val: string): void {
    this.searchWords = val
  }
}

export default getModule(DoctorSearchFiltersStore);