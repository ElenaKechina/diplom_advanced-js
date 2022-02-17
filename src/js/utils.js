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
