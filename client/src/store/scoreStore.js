import { makeAutoObservable } from "mobx";

class ScoreStore {
  constructor() {
    this._score = 0;
    makeAutoObservable(this);
  }

  setScore(score) {
    this._score = score;
  }

  get score() {
    return this._score;
  }
}

export default new ScoreStore();