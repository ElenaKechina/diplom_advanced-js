export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('You can\'t directly create a class "Character"');
    }

    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.team = null;
    // TODO: throw error if user use "new Character()"
  }
  static levelApp(character) {
    character.level++;

    character.attack = Math.round(
      Math.max(character.attack, character.attack * (1.8 - (1 - character.health / 100)))
    );
    character.defence = Math.round(
      Math.max(character.defence, character.defence * (1.8 - (1 - character.health / 100)))
    );

    character.health += 80;

    if (character.health > 100) {
      character.health = 100;
    }
  }

  currentLevel() {
    if (this.level <= 1) {
      return;
    }

    this.health += Math.round(50 * ((this.level - 1) / 3));
    this.attack = Math.round(this.attack * 1.3 ** (this.level - 1));
    this.defence = Math.round(this.defence * 1.3 ** (this.level - 1));
  }

  setTeam(id) {
    this.team = id;
  }
}
