import {
  VuexModule,
  Module,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import store from "@/store";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "GlobalsStore"
})
class GlobalsStore extends VuexModule {

  get NativeWindow(): Window {
    return window;
  }
}

export default getModule(GlobalsStore);