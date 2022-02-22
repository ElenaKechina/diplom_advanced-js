import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.type = 'vampire';
    this.attack = 25;
    this.defence = 25;
    this.motion = 2;
    this.attackDistance = 2;
    this.currentLevel();
  }
}
