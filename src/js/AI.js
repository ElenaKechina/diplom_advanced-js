import { indicesCell } from './utils';
import GameState from './GameState';

class AI {
  constructor() {
    this.select;
    this.click;
    this.positions;
    this.teamId;
    this.userTeamId;
    this.movePosition = {
      maxValue: 1,
      characterPosition: null,
      actionPosition: null,
    };
  }

  init(select, click, gameState) {
    this.select = select;
    this.click = click;
    this.gameState = gameState;
    this.positions = gameState.positionedCharacters.positions;
    this.teamId = this.gameState.aiTeam.id;
    this.userTeamId = this.gameState.userTeam.id;
  }

  move() {
    if (this.gameState.isMoveUser || GameState.isAiMove) {
      return;
    }
    GameState.isAiMove = true;

    this.getMove();

    setTimeout(() => {
      this.select(this.movePosition.characterPosition);
      setTimeout(() => {
        this.click(this.movePosition.characterPosition);
        setTimeout(() => {
          this.select(this.movePosition.actionPosition);
          setTimeout(() => {
            this.click(this.movePosition.actionPosition);
            GameState.isAiMove = false;
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  }

  getMove() {
    this.movePosition.maxValue = -1;

    this.positions.forEach((positionedCharacter) => {
      if (positionedCharacter.character.team !== this.teamId) {
        return;
      }
      let matrix = this.getAttackMatrix(positionedCharacter.position);

      const maxAttack = this.getMatrixMaxPosition(matrix);

      if (maxAttack.value > this.movePosition.maxValue) {
        this.movePosition.maxValue = maxAttack.value;
        this.movePosition.actionPosition = maxAttack.position;
        this.movePosition.characterPosition = positionedCharacter.position;
      }

      matrix = this.getMotionMatrix(positionedCharacter.position);

      const maxMotion = this.getMatrixMaxPosition(matrix);

      if (maxMotion.value > this.movePosition.maxValue) {
        this.movePosition.maxValue = maxMotion.value;
        this.movePosition.actionPosition = maxMotion.position;
        this.movePosition.characterPosition = positionedCharacter.position;
      }
    });
  }

  getAttackMatrix(position, size = 8) {
    const matrix = this.matrixZero(size, -1);

    const positionedCharacter = this.positions.find(
      (positionedCharacter) => positionedCharacter.position === position
    );
    const attack = positionedCharacter.character.attack;
    const characterIndices = indicesCell(positionedCharacter.position, size);
    const attackDistance = positionedCharacter.character.attackDistance;

    this.positions.forEach((positionedCharacter) => {
      if (positionedCharacter.character.team !== this.userTeamId) {
        return;
      }
      const position = positionedCharacter.position;
      const [i, j] = indicesCell(position, size);

      if (
        Math.abs(i - characterIndices[0]) > attackDistance ||
        Math.abs(j - characterIndices[1]) > attackDistance
      ) {
        return;
      }

      const damage = Math.max(attack - positionedCharacter.character.defence, attack * 0.1);
      matrix[i][j] = damage + 1;
    });

    return matrix;
  }

  getMotionMatrix(position, size = 8) {
    let matrix = this.matrixZero(size, 0);

    const positionedCharacter = this.positions.find(
      (positionedCharacter) => positionedCharacter.position === position
    );

    const attack = positionedCharacter.character.attack;
    const attackDistance = positionedCharacter.character.attackDistance;
    const characterIndices = indicesCell(positionedCharacter.position, size);
    const motionDistance = positionedCharacter.character.motion;

    this.positions.forEach((positionedCharacter) => {
      if (positionedCharacter.character.team !== this.teamId) {
        return;
      }
      const position = positionedCharacter.position;
      const [i, j] = indicesCell(position, size);
      matrix[i][j] = -10;
    });

    this.positions.forEach((positionedCharacter) => {
      if (positionedCharacter.character.team !== this.userTeamId) {
        return;
      }

      const position = positionedCharacter.position;
      const [i, j] = indicesCell(position, size);

      matrix = this.attackArea(
        [i, j],
        attack,
        attackDistance,
        positionedCharacter.character,
        matrix,
        motionDistance,
        characterIndices
      );
    });

    return matrix;
  }

  attackArea(
    indices,
    attack,
    attackDistance,
    character,
    matrixIn,
    motionDistance,
    characterIndices
  ) {
    const defence = character.defence;
    const userAttackDistance = character.attackDistance;
    const damage = Math.max(attack - defence, attack * 0.1);

    const matrix = [...matrixIn];

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === -10) {
          continue;
        }
        const damageRadius =
          damage - Math.max(indices[0] - i, i - indices[0], indices[1] - j, j - indices[1]);

        if (matrix[i][j] < damageRadius) {
          matrix[i][j] = damageRadius;
        }

        if (
          i >= indices[0] - attackDistance &&
          i <= indices[0] + attackDistance &&
          j >= indices[1] - attackDistance &&
          j <= indices[1] + attackDistance
        ) {
          if (matrix[i][j] < damage) {
            matrix[i][j] = damage;
          }
        }

        if (
          i >= indices[0] - userAttackDistance &&
          i <= indices[0] + userAttackDistance &&
          j >= indices[1] - userAttackDistance &&
          j <= indices[1] + userAttackDistance
        ) {
          matrix[i][j] -= 1;
        }

        if (
          Math.abs(i - characterIndices[0]) > motionDistance ||
          Math.abs(j - characterIndices[1]) > motionDistance
        ) {
          matrix[i][j] = -1;
        }
      }
    }
    matrix[indices[0]][indices[1]] = -10;

    return matrix;
  }

  getMatrixMaxPosition(matrix) {
    const size = matrix.length;

    let max = -1;
    let position = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j] > max) {
          max = matrix[i][j];
          position = i * size + j;
        }
      }
    }
    return { value: max, position };
  }

  matrixZero(size, value) {
    const matrix = [];

    matrix.length = size;

    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i].push(value);
      }
    }
    return matrix;
  }
}

export default AI;
