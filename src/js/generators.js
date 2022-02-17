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
  const level = getRandomIntInclusive(maxLevel);

  yield new allowedTypes[index](level);

  // TODO: write logic here
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  team.length(characterCount);

  team.forEach((value, index) => {
    team[index] = [...characterGenerator(allowedTypes, maxLevel)][0];
  });

  return team;
}
