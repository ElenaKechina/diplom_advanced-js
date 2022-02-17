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
    // TODO: throw error if user use "new Character()"
  }
}
