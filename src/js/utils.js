export function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) {
    return 'top-left';
  }

  if (index === boardSize - 1) {
    return 'top-right';
  }

  if (index < boardSize) {
    return 'top';
  }

  if (index === boardSize * boardSize - 1) {
    return 'bottom-right';
  }

  if (index === boardSize * boardSize - boardSize) {
    return 'bottom-left';
  }

  if (index % boardSize === 0) {
    return 'left';
  }

  if (index % boardSize === boardSize - 1) {
    return 'right';
  }

  if (index > boardSize * boardSize - boardSize) {
    return 'bottom';
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getRandomIntInclusive(max, min = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export const indicesCell = (cell, boardSize) => {
  const i = Math.floor(cell / boardSize);
  const j = cell % boardSize;

  return [i, j];
};

export const isCellInSquare = (cell, centerCell, radius, boardSize = 8) => {
  const indices = indicesCell(cell, boardSize);
  const indicesCenter = indicesCell(centerCell, boardSize);

  const resultI = Math.abs(indices[0] - indicesCenter[0]);
  const resultJ = Math.abs(indices[1] - indicesCenter[1]);

  return resultI <= radius && resultJ <= radius;
};

const uniqueNumber = () => {
  const data = [];
  return random;

  function random() {
    const number = Math.round(Math.random() * 100);
    if (!data.includes(number)) {
      data.push(number);
      return number;
    }
    return random();
  }
};

export const getId = uniqueNumber();
