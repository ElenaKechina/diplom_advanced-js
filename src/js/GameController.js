import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Swordsman from './Characters/Swordsman';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import cursors from './cursors';
import GamePlay from './GamePlay';
import GameState from './GameState';
import { generateTeam } from './generators';
import themes from './themes';
import { isCellInSquare } from './utils';
import AI from './AI';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState(gamePlay.boardSize);
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.AI = new AI();
  }

  init() {
    this.gameState.action = 'select';
    this.startGame(this.gameState.level);
    this.AI.init(this.onCellEnter.bind(this), this.onCellClick.bind(this), this.gameState);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  async onCellClick(index) {
    if (this.gameState.action === 'end game') {
      return;
    }

    await this.actionClick(this.gameState.action, index);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters.positions);
    this.isEndGame();

    setTimeout(() => {
      this.AI.init(this.onCellEnter.bind(this), this.onCellClick.bind(this), this.gameState);
      this.AI.move();
      this.gamePlay.setCursor(cursors.auto);
      // this.isEndGame();
    }, 300);

    // TODO: react to click
  }

  onCellEnter(index) {
    if (this.gameState.isSelected) {
      this.selectedAction(index);
    }

    const character = this.characterInCell(index);

    if (!character) {
      return;
    }
    const message = `\u{1F396}${character.character.level}\u{2694}${character.character.attack}\u{1F6E1}${character.character.defence}\u{2764}${character.character.health}`;

    this.gamePlay.showCellTooltip(message, index);

    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    // TODO: react to mouse leave
  }

  selectedAction(index) {
    const selectedCharacter = this.characterInCell(this.gameState.selectCell);

    if (index === selectedCharacter.position) {
      return;
    }

    if (this.activCellUnderCursor !== selectedCharacter.position && this.activCellUnderCursor) {
      this.gamePlay.deselectCell(this.activCellUnderCursor);
    }

    this.activCellUnderCursor = index;

    let typeCharacterInCell = null;
    const positionedCharacter = this.characterInCell(index);

    const [activTeam, notActivTeam] = this.gameState.isMoveUser
      ? [this.gameState.userTeam.id, this.gameState.aiTeam.id]
      : [this.gameState.aiTeam.id, this.gameState.userTeam.id];

    if (positionedCharacter?.character.team === activTeam) {
      typeCharacterInCell = 'friend';
    }

    if (positionedCharacter?.character.team === notActivTeam) {
      typeCharacterInCell = 'enemy';
    }

    if (
      isCellInSquare(
        index,
        selectedCharacter.position,
        selectedCharacter.character.attackDistance,
        this.gamePlay.boardSize
      ) &&
      typeCharacterInCell === 'enemy'
    ) {
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.setCursor(cursors.crosshair);
      this.gameState.action = 'attack';
      return;
    }

    if (typeCharacterInCell === 'friend') {
      this.gamePlay.setCursor(cursors.pointer);
      this.gameState.action = 'select';
      return;
    }

    if (
      isCellInSquare(
        index,
        selectedCharacter.position,
        selectedCharacter.character.motion,
        this.gamePlay.boardSize
      ) &&
      !typeCharacterInCell
    ) {
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor(cursors.pointer);
      this.gameState.action = 'motion';
      return;
    }

    this.gamePlay.setCursor(cursors.notallowed);
    this.gameState.action = 'select';
  }

  characterInCell(index) {
    const character = this.gameState.positionedCharacters.positions.find(
      (position) => position.position === index
    );

    return character;
  }

  async actionClick(action, index) {
    if (action === 'select') {
      const positionedCharacter = this.characterInCell(index);

      if (this.gameState.selectCell) {
        this.gamePlay.deselectCell(this.gameState.selectCell);
        this.gameState.selectCell = null;
        this.gameState.isSelected = false;
        this.gamePlay.setCursor(cursors.auto);
      }

      if (!positionedCharacter) {
        return;
      }

      const activTeam = this.gameState.isMoveUser
        ? this.gameState.userTeam.id
        : this.gameState.aiTeam.id;

      if (positionedCharacter.character.team !== activTeam) {
        GamePlay.showError("Other team's move");
        return;
      }

      this.gamePlay.selectCell(index);
      this.gameState.selectCell = index;
      this.gameState.isSelected = true;

      return;
    }

    const selectedPositionedCharacter = this.characterInCell(this.gameState.selectCell);
    const reset = () => {
      this.gameState.isSelected = false;
      this.gamePlay.deselectCell(this.gameState.selectCell);
      this.gameState.selectCell = null;
      this.gamePlay.deselectCell(this.activCellUnderCursor);
      this.activCellUnderCursor = null;
      this.gameState.action = 'select';
      this.gameState.isMoveUser = !this.gameState.isMoveUser;
    };

    if (action === 'motion') {
      selectedPositionedCharacter.position = index;
      reset();
      return;
    }

    if (action === 'attack') {
      const attackedPositionedCharacter = this.characterInCell(index);
      const damage = Math.round(
        Math.max(
          selectedPositionedCharacter.character.attack -
            attackedPositionedCharacter.character.defence,
          selectedPositionedCharacter.character.attack * 0.1
        )
      );

      attackedPositionedCharacter.character.health -= damage;

      await this.gamePlay.showDamage(index, damage);
      reset();

      this.gameState.positionedCharacters.update();

      return;
    }
  }

  startGame(lavel) {
    this.gameState.positionedCharacters.clear();

    switch (lavel) {
      case 1: {
        this.gamePlay.drawUi(themes.prairie);
        this.gameState.userTeam.add(generateTeam([Bowman, Swordsman], 1, 2));
        this.gameState.aiTeam.add(generateTeam([Undead, Vampire, Daemon], 1, 2));

        break;
      }

      case 2: {
        this.gamePlay.drawUi(themes.desert);
        this.gameState.userTeam.levelApp();
        this.gameState.userTeam.add(generateTeam([Bowman, Swordsman, Magician], 1, 1));
        this.gameState.aiTeam.add(
          generateTeam([Undead, Vampire, Daemon], 2, this.gameState.userTeam.team.length)
        );

        break;
      }

      case 3: {
        this.gamePlay.drawUi(themes.arctic);
        this.gameState.userTeam.levelApp();
        this.gameState.userTeam.add(generateTeam([Bowman, Swordsman, Magician], 2, 1));
        this.gameState.aiTeam.add(
          generateTeam([Undead, Vampire, Daemon], 3, this.gameState.userTeam.team.length)
        );

        break;
      }

      case 4: {
        this.gamePlay.drawUi(themes.desert);
        this.gameState.userTeam.levelApp();
        this.gameState.userTeam.add(generateTeam([Bowman, Swordsman, Magician], 3, 1));
        this.gameState.aiTeam.add(
          generateTeam([Undead, Vampire, Daemon], 4, this.gameState.userTeam.team.length)
        );

        break;
      }
    }

    this.gameState.positionedCharacters.setUserTeam(this.gameState.userTeam);
    this.gameState.positionedCharacters.setAiTeam(this.gameState.aiTeam);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters.positions);
  }

  isEndGame() {
    const endGame = () => {
      if (this.gameState.score > localStorage.getItem('score')) {
        localStorage.setItem('score', this.gameState.score.toString());
      }
      this.gameState.action = 'end game';
    };

    const scoring = () =>
      this.gameState.userTeam.team.reduce((acc, character) => acc + character.health, 0);

    if (!this.gameState.userTeam.team.length) {
      GamePlay.showMessage(
        `GameOwer\nyour score = ${this.gameState.score}\nmax score = ${localStorage.getItem(
          'score'
        )}`
      );
      endGame();
    }

    if (!this.gameState.aiTeam.team.length) {
      this.gameState.level++;
      this.gameState.score += scoring();

      if (this.gameState.level > 4) {
        GamePlay.showMessage(
          `You Winner!\nyour score = ${this.gameState.score}\nmax score = ${localStorage.getItem(
            'score'
          )}`
        );

        endGame();
        return;
      }
      this.startGame(this.gameState.level);
    }
  }

  newGame() {
    this.gameState.clear();
    this.init();
  }

  saveGame() {
    this.gameState.save();
  }

  loadGame() {
    this.gameState.clear();
    this.gameState.load();
    let theme;

    switch (this.gameState.level) {
      case 1: {
        theme = themes.prairie;
        break;
      }

      case 2: {
        theme = themes.desert;
        break;
      }

      case 3: {
        theme = themes.arctic;
        break;
      }

      case 4: {
        theme = themes.mountain;

        break;
      }
    }
    this.AI.init(this.selectedAction.bind(this), this.actionClick.bind(this), this.gameState);

    this.gamePlay.drawUi(theme);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters.positions);

    if (this.gameState.isSelected) {
      this.gamePlay.selectCell(this.gameState.selectCell);
    }
  }
}
