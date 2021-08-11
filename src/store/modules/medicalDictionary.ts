import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import firebase from "firebase";
import { DictionaryWord, WordType } from "../models";
//import HTTP from "@/http";
import PUBLIC_HTTP from '@/public-http';
config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "medicalDictionaryStore"
})
class MedicalDictionaryStore extends VuexModule {
  public currentWords: DictionaryWord[] = [];
  /* An @Action only can receive one argument */
  @Mutation
  SET_CURRENTWORDS(val: DictionaryWord[]) {
    this.currentWords = val;
  }

  @Action
  async fetchWordsBy(data: { type: WordType.SPECIALTY, recordStatus: string }) {
    const { type, recordStatus } = data;
    const queryParams = `?type=${type}&recordStatus=${recordStatus}`;
    const result = await PUBLIC_HTTP().get("/medical-dictionary" + queryParams);
    const querySnapshot = result.data.data as DictionaryWord[];
    
    this.SET_CURRENTWORDS(querySnapshot);
  }
}

export default getModule(MedicalDictionaryStore);
