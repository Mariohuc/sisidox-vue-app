import {
  VuexModule,
  Module,
  Mutation,
  Action,
  config,
  getModule
} from "vuex-module-decorators";
import { User, Role } from "../models";
import store from "@/store";
import firebase from "firebase";
import HTTP from "@/http";
import { DateTime } from "luxon";

config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "authStore"
})
class AuthStore extends VuexModule implements User {
  public token = "";

  public uid = "";
  public email = "";
  public displayName = "";
  public phoneNumber = "";
  public photoURL = "";
  public roles: string[] = [];
  public disabled = false;

  public currentUserMode: Role = Role.GUEST;
  //vuex-module-decorators allow Automatic getter detection
  @Mutation
  SET_TOKEN(token: string) {
    this.token = token;
  }
  @Mutation
  SET_UID(uid: string) {
    this.uid = uid;
  }
  @Mutation
  SET_EMAIL(email: string) {
    this.email = email;
  }
  @Mutation
  SET_DISPLAYNAME(displayName: string) {
    this.displayName = displayName;
  }
  @Mutation
  SET_PHONENUMBER(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }
  @Mutation
  SET_PHOTOURL(photoURL: string) {
    this.photoURL = photoURL;
  }
  @Mutation
  SET_ROLES(roles: string[]) {
    this.roles = roles;
  }
  @Mutation
  SET_DISABLED(disabled: boolean) {
    this.disabled = disabled;
  }

  @Mutation
  SET_CURRENT_USER_MODE(role: Role) {
    this.currentUserMode = role;
  }

  @Action
  resetState() {
    this.SET_TOKEN("");
    this.SET_UID("");
    this.SET_EMAIL("");
    this.SET_DISPLAYNAME("");
    this.SET_PHONENUMBER("");
    this.SET_PHOTOURL("");
    this.SET_ROLES([]);
    this.SET_DISABLED(false);
  }
  @Action
  setState(userData: User) {
    this.SET_UID(userData.uid);
    this.SET_EMAIL(userData.email);
    this.SET_DISPLAYNAME(userData.displayName);
    this.SET_PHONENUMBER(userData.phoneNumber);
    this.SET_PHOTOURL(userData.photoURL);
    this.SET_ROLES(userData.roles);
    this.SET_DISABLED(userData.disabled);
  }
  @Action
  loadUser(userData: any) {
    this.SET_UID(userData.id);
    this.SET_EMAIL(userData.email);
    this.SET_DISPLAYNAME(userData.displayName);
    this.SET_PHONENUMBER(userData.phoneNumber);
    this.SET_PHOTOURL(userData.photoURL);
    const roles: Role[] = [];
    if( userData.isAdmin === 1 || userData.isAdmin === true ) roles.push(Role.ADMINISTRATOR);
    if( userData.isDoctor === 1 || userData.isDoctor === true ) roles.push(Role.DOCTOR);
    if( userData.isPatient === 1 || userData.isPatient === true ) roles.push(Role.PATIENT);

    this.SET_ROLES(roles); 
    this.SET_DISABLED(userData.recordStatus === 'A' ? false : true);
  }

  @Action
  async fetchUser(user: firebase.User) {
    const token = await user.getIdToken();
    this.SET_TOKEN(token);
    const result: any = await HTTP().get('/users/' + user.uid );
    const _user: any = result.data.data;
    if (_user) {
      this.loadUser(_user)
      this.getRouteByPriorityRole()
    }
  }

  @Action
  async signInWithGoogle(userRol : Role = Role.PATIENT) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const dataUser = result.user;

    if (!dataUser) throw new Error("User from firebase was returned as null");
    const token = await dataUser.getIdToken();
    this.SET_TOKEN(token);
    const result02: any = await HTTP().get('/users/' + dataUser.uid );
    const _user: any = result02.data.data;
    let dataToSave: any = null;
    if (!_user) {
      dataToSave = {
        id: dataUser.uid,
        email: dataUser.email,
        displayName: dataUser.displayName,
        photoURL: dataUser.photoURL,
        phoneNumber: dataUser.phoneNumber,
        emailVerified: dataUser.emailVerified,
        isAdmin: userRol === Role.ADMINISTRATOR ? true : false,
        isDoctor: userRol === Role.DOCTOR ? true : false,
        isPatient: userRol === Role.PATIENT ? true : false,
        recordStatus: 'A'
      }
      await this.saveUserData(dataToSave)
    } else {      
      dataToSave = {
        id: _user.id,
        displayName: dataUser.displayName,
        photoURL: dataUser.photoURL,
        phoneNumber: dataUser.phoneNumber,
      }
      switch(userRol){
        case Role.ADMINISTRATOR: if(_user.isAdmin !== 1) dataToSave.isAdmin = true; break;
        case Role.DOCTOR: if(_user.isDoctor !== 1) dataToSave.isDoctor = true; break;
        default: if(_user.isPatient !== 1) dataToSave.isPatient = true; break;
      }
      await this.updateUserData(dataToSave);

      dataToSave = Object.assign({}, _user, dataToSave );
    }
    
    this.loadUser(dataToSave);
    this.getRouteByPriorityRole()
  }

  @Action
  async logout() {
    await firebase.auth().signOut();
  }

  @Action
  async saveUserData(userData: any){
    await HTTP().post('/users', userData );
  }
  @Action
  async updateUserData(userData: any){
    await HTTP().patch('/users', userData );
  }

  @Action
  getRouteByPriorityRole(): void {
    if( this.roles.some(item => item === Role.ADMINISTRATOR) ){
      this.SET_CURRENT_USER_MODE(Role.ADMINISTRATOR)
    }else if( this.roles.some(item => item === Role.DOCTOR) ){
      this.SET_CURRENT_USER_MODE(Role.DOCTOR)
    }else if( this.roles.some(item => item === Role.PATIENT) ){
      this.SET_CURRENT_USER_MODE(Role.PATIENT)
    };

  }
}

export default getModule(AuthStore);
