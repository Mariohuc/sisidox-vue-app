import { VuexModule, Module, config, getModule } from "vuex-module-decorators";
import { Role, Menu } from "../models";
import store from "@/store";

config.rawError = true;

@Module({
  dynamic: true,
  store,
  name: "menuItemsStore"
})
class MenuItemsStore extends VuexModule {
  // ---> "state" is the route, "name" is like a label
  /**
   * Images are from https://www.flaticon.es/, visit for more icoimages
   */
  public MENUITEMS: Menu[] = [
    {
      state: "booked-appointments",
      name: "Citas Reservadas",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/booked-appointment.png",
      belongTo: [Role.PATIENT]
    },
    {
      state: "medical-record",
      name: "Historial Médico",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/medical-record.png",
      belongTo: [Role.PATIENT]
    },
    {
      state: "general-agenda",
      name: "Agenda General",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/agenda.png",
      belongTo: [Role.DOCTOR]
    },
    {
      state: "medical-records",
      name: "Historiales Médicos",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/medical-record-2.png",
      belongTo: [Role.DOCTOR]
    },
    {
      state: "scheduled-appointments",
      name: "Citas Programadas",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/scheduled-appointment.png",
      belongTo: [Role.DOCTOR]
    },
    {
      state: "configurations",
      name: "Configuraciones",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/configurations.png",
      belongTo: [Role.PATIENT, Role.DOCTOR]
    },
    {
      state: "/admin/dashboard",
      name: "Dashboard",
      type: "link",
      icon: "mdi-home",
      imagePath: "img/scheduled-appointment.png",
      belongTo: [Role.ADMINISTRATOR]
    },
    {
      state: "/admin/access-creation",
      name: "Creación de accesos",
      type: "link",
      icon: "mdi-account-key",
      imagePath: "img/scheduled-appointment.png",
      belongTo: [Role.ADMINISTRATOR]
    }
  ];
}

export default getModule(MenuItemsStore);
