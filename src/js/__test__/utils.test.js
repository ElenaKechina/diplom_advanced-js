import { calcTileType, getId, isCellInSquare } from '../utils';

describe('Function calcTileType:', () => {
  test('should return string', () => {
    expect(calcTileType(0, 8)).toBe('top-left');
    expect(calcTileType(7, 8)).toBe('top-right');
    expect(calcTileType(56, 8)).toBe('bottom-left');
    expect(calcTileType(63, 8)).toBe('bottom-right');
    expect(calcTileType(15, 8)).toBe('right');
    expect(calcTileType(16, 8)).toBe('left');
    expect(calcTileType(62, 8)).toBe('bottom');
    expect(calcTileType(3, 8)).toBe('top');
    expect(calcTileType(20, 8)).toBe('center');
  });
});

describe('isCellInSquare function:', () => {
  test('should return true/false', () => {
    expect(isCellInSquare(9, 16, 2, 8)).toBe(true);
    expect(isCellInSquare(9, 24, 2, 8)).toBe(true);
    expect(isCellInSquare(9, 32, 2, 8)).toBe(false);
  });
});

describe('getId function:', () => {
  test('should return unique Id', () => {
    const result = [];
    for (let i = 0; i < 100; i++) {
      result.push[i];
    }

    const arrayId = [];
    for (let i = 0; i < 100; i++) {
      arrayId.push[getId()];
    }

    expect(arrayId.sort((a, b) => a - b)).toEqual(result);
  });
});
