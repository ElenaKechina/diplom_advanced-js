import Character from './Character';
import { getId } from './utils';

export default class Team {
  constructor() {
    this.team = [];
    this.id = getId();
  }

  add(items) {
    items.forEach((item) => {
      item.setTeam(this.id);
      this.team.push(item);
    });
  }

  removeDead() {
    this.team.forEach((character, index) => {
      if (character.health <= 0) {
        this.team.splice(index, 1);
      }
    });
  }

  levelApp() {
    this.team.forEach((character) => {
      Character.levelApp(character);
    });
  }
}
