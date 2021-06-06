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
  async fetchWordsBy(data: {
    type: WordType.SPECIALTY
  }) {
    const { type } = data;
    const querySnapshot = await firebase
      .firestore()
      .collection("medicalDictionary")
      .where("type", "==", type)
      .get();
    
      const words: DictionaryWord[] = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const { name, description, type, metadata, disabled } = doc.data();
        const record: DictionaryWord = {
          uid: doc.id,
          name,
          description,
          type,
          metadata,
          disabled
        };
        words.push(record);
      });  
      this.SET_CURRENTWORDS(words);
  }
}

export default getModule(MedicalDictionaryStore);
