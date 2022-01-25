import {
  VuexModule,
  Module,
  Action,
  config,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { DateTime } from "luxon";
import HTTP from "@/http";

config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "settingsStore"
})
class SettingsStore extends VuexModule {
  requestDataSize = 500;
}

export default getModule(SettingsStore);
