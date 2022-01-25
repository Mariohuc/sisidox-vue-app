import {
  VuexModule,
  Module,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import HTTP from "@/http";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "RatingsStore"
})
class RatingsStore extends VuexModule {
  
  @Action
  async getAllRatings( params: {
    qualifiedUserId?: string,
    whoDoesRatingId?: string,
    bookedAppointmentId?: string,
    recordStatus?: string
  }): Promise<any> {
    const { data }: any = await HTTP().get('/ratings', { params })
    return data.data;
  }

  @Action
  async getRatingById(ratingId: string): Promise<any> {
    const { data }: any = await HTTP().get('/ratings/' + ratingId)
    return data.data;
  }

  @Action
  async createRating(formData: {
    qualifiedUserId?: string,
    rating?: number,
    comment?: string,
    whoDoesRatingId?: string,
    isQualifierApatient?: boolean,
    bookedAppointmentId?: string,
    recordStatus?: string
  }):  Promise<any> {
    const { data }: any = await HTTP().post('/ratings', formData)
    return data.data;
  }

  @Action
  async updateRating(ratingId: string, formData: {
    qualifiedUserId?: string,
    rating?: number,
    comment?: string,
    whoDoesRatingId?: string,
    isQualifierApatient?: boolean,
    bookedAppointmentId?: string,
    recordStatus?: string
  }): Promise<any> {
    const { data }: any = await HTTP().patch('/ratings/' + ratingId, formData)
    return data.data;
  }

}

export default getModule(RatingsStore);