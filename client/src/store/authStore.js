import { makeAutoObservable } from "mobx";

class AuthStore {
  constructor() {
    this._user = null;
    this._auth = null;
    makeAutoObservable(this);
  }

  setUser(user) {
    this._user = user;
  }

  setAuth(auth) {
    this._auth = auth;
  }

  get auth() {
    return this._auth;
  }

  get user() {
    return this._user;
  }
}

export default new AuthStore();
