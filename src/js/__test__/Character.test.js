import Bowman from '../Characters/Bowman';
const { default: Character } = require('../Character');

describe('Character class:', () => {
  test('should return Throw', () => {
    expect(() => {
      new Character(1);
    }).toThrow();
  });

  test('should not return Throw ', () => {
    class Bowman extends Character {
      constructor(level) {
        super(level);
      }
    }

    expect(() => {
      new Bowman(1);
    }).not.toThrow();
  });

  test('should to level up', () => {
    let bowman = new Bowman(1);

    let result = {
      attack: 25,
      defence: 25,
      health: 50,
      level: 1,
      type: 'bowman',
    };

    expect({
      attack: bowman.attack,
      defence: bowman.defence,
      health: bowman.health,
      level: bowman.level,
      type: bowman.type,
    }).toEqual(result);

    Character.levelApp(bowman);
    result = {
      attack: 33,
      defence: 33,
      health: 100,
      level: 2,
      type: 'bowman',
    };

    expect({
      attack: bowman.attack,
      defence: bowman.defence,
      health: bowman.health,
      level: bowman.level,
      type: bowman.type,
    }).toEqual(result);

    bowman = new Bowman(2);
    result.health = 67;

    expect({
      attack: bowman.attack,
      defence: bowman.defence,
      health: bowman.health,
      level: bowman.level,
      type: bowman.type,
    }).toEqual(result);
  });
});
