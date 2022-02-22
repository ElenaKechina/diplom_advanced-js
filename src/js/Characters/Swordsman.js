import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.type = 'swordsman';
    this.attack = 40;
    this.defence = 10;
    this.motion = 4;
    this.attackDistance = 1;
    this.currentLevel();
  }
}
