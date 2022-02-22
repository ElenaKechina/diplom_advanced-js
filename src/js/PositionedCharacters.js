import PositionedCharacter from './PositionedCharacter';
import { getRandomIntInclusive } from './utils';

export default class PositionedCharacters {
  constructor(borderSize) {
    this.allowedAIPosition = [];
    this.allowedUserPosition = [];
    this.PositionedCharactersOnBoard = [];
    this.userTeam;
    this.aiTeam;

    for (let i = 0; i < borderSize; i++) {
      this.allowedUserPosition.push(i * borderSize);
      this.allowedUserPosition.push(i * borderSize + 1);

      this.allowedAIPosition.push(i * borderSize + 6);
      this.allowedAIPosition.push(i * borderSize + 7);
    }
  }

  setUserTeam(team) {
    this.userTeam = team;
    team.team.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, this.startPosition('User'));
      this.PositionedCharactersOnBoard.push(positionedCharacter);
    });
  }

  setAiTeam(team) {
    this.aiTeam = team;
    team.team.forEach((character) => {
      const positionedCharacter = new PositionedCharacter(character, this.startPosition('AI'));
      this.PositionedCharactersOnBoard.push(positionedCharacter);
    });
  }

  startPosition(typePosition) {
    const allowedPosition =
      typePosition === 'User' ? this.allowedUserPosition : this.allowedAIPosition;

    const position = allowedPosition[getRandomIntInclusive(allowedPosition.length - 1)];

    if (
      !this.PositionedCharactersOnBoard.find(
        (positionedCharacter) => positionedCharacter.position === position
      )
    ) {
      return position;
    }

    return this.startPosition(typePosition);
  }

  update() {
    this.userTeam.removeDead();
    this.aiTeam.removeDead();

    const deleteIndex = this.PositionedCharactersOnBoard.findIndex(
      (positionedCharacter) => positionedCharacter.character.health <= 0
    );

    if (~deleteIndex) {
      this.PositionedCharactersOnBoard.splice(deleteIndex, 1);
    }
  }

  clear() {
    this.PositionedCharactersOnBoard = [];
  }

  get positions() {
    return this.PositionedCharactersOnBoard;
  }

  set positions(data) {
    this.PositionedCharactersOnBoard = data;
  }

  load() {
    let indexUserTeam = 0;
    let indexAiTeam = 0;

    this.PositionedCharactersOnBoard.forEach((positionedCharacter, index) => {
      const teamId = positionedCharacter.character.team;

      if (teamId === this.userTeam.id) {
        this.PositionedCharactersOnBoard[index].character = this.userTeam.team[indexUserTeam];
        indexUserTeam++;
      } else {
        this.PositionedCharactersOnBoard[index].character = this.aiTeam.team[indexAiTeam];
        indexAiTeam++;
      }
    });
  }
}
