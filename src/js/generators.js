import { getRandomIntInclusive } from './utils';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const index = getRandomIntInclusive(allowedTypes.length - 1);
  const level = getRandomIntInclusive(maxLevel, 1);

  yield new allowedTypes[index](level);

  // TODO: write logic here
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];

  for (let i = 0; i < characterCount; i++) {
    team[i] = [...characterGenerator(allowedTypes, maxLevel)][0];
  }

  return team;
}
