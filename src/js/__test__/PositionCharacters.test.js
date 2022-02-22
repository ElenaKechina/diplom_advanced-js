import PositionedCharacters from '../PositionedCharacters';

describe('PositionCharacter class:', () => {
  test('should return allowed position', () => {
    const positions = new PositionedCharacters(8);

    expect(positions.allowedUserPosition).toEqual([
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ]);
    expect(positions.allowedAIPosition).toEqual([
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ]);
  });
});
