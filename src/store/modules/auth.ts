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

config.rawError = true;

//type Nullable<T> = T | undefined | null;

@Module({
  dynamic: true,
  store,
  name: "authStore"
})
class AuthStore extends VuexModule implements User {
  public uid = "";
  public email = "";
  public displayName = "";
  public phoneNumber = "";
  public photoURL = "";
  public roles: string[] = [];
  public disabled = false;

  //vuex-module-decorators allow Automatic getter detection
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

  @Action
  resetState() {
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
  async fetchUser(user: firebase.User) {
    const docRef = firebase.firestore().collection("users").doc(user.uid);

    const doc = await docRef.get();
    if (doc.exists) {
      const userdoc = doc.data();
      if (!userdoc) throw new Error("User from FIRESTORE was returned as null");
      this.SET_UID(userdoc.uid);
      this.SET_EMAIL(userdoc.email);
      this.SET_DISPLAYNAME(userdoc.displayName);
      this.SET_PHONENUMBER(userdoc.phoneNumber);
      this.SET_PHOTOURL(userdoc.photoURL);
      this.SET_ROLES(userdoc.roles);
      this.SET_DISABLED(userdoc.disabled);
    }
  }

  @Action
  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const dataUser = result.user;

    if (!dataUser) throw new Error("User from firebase was returned as null");

    const docRef = firebase.firestore().collection("users").doc(dataUser.uid);

    const doc = await docRef.get();
    let data = null,
      user = null;
    if (!doc.exists) {
      data = {
        uid: dataUser.uid,
        email: dataUser.email,
        displayName: dataUser.displayName,
        photoURL: dataUser.photoURL,
        phoneNumber: dataUser.phoneNumber,
        roles: [Role.PATIENT],
        disabled: false
      };
      user = <User> data;
    } else {
      data = {
        displayName: dataUser.displayName,
        photoURL: dataUser.photoURL,
        phoneNumber: dataUser.phoneNumber
      };
      const userdoc = doc.data();
      user = {
        ...data,
        uid: userdoc?.uid,
        email: userdoc?.email,
        roles: userdoc?.roles,
        disabled: userdoc?.disabled
      } as User; //merge data
    }
    await firebase
      .firestore()
      .collection("users")
      .doc(dataUser.uid)
      .set(data, { merge: true });
    this.setState(user);
  }

  @Action
  async logout() {
    await firebase.auth().signOut();
  }
}

export default getModule(AuthStore);
