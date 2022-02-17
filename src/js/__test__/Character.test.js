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
});
