import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level);
    this.type = 'bowman';
    this.attack = 25;
    this.defence = 25;
    this.currentLevel();
    this.motion = 2;
    this.attackDistance = 2;
  }
}
