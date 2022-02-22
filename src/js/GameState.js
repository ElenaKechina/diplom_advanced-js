import Team from './Team';
import PositionedCharacters from './PositionedCharacters';
import GamePlay from './GamePlay';

export default class GameState {
  constructor(boardSize) {
    this.level = 1;
    this.score = 0;
    this.action = 'select';
    this.isSelected = false;
    this.selectCell = null;
    this.isMoveUser = true;
    this.userTeam = new Team();
    this.aiTeam = new Team();
    this._isAiMove = false;
    this.positionedCharacters = new PositionedCharacters(boardSize);
  }

  static set isAiMove(type) {
    this._isAiMove = type;
  }
  static get isAiMove() {
    return this._isAiMove;
  }

  clear() {
    this.level = 1;
    this.score = 0;
    this.action = 'select';
    this.isSelected = false;
    this.selectCell = null;
    this.isMoveUser = true;
    this.userTeam = new Team();
    this.aiTeam = new Team();
    this.positionedCharacters.clear();
  }

  save() {
    const storage = {
      level: this.level,
      score: this.score,
      action: this.action,
      isSelected: this.isSelected,
      selectCell: this.selectCell,
      isMoveUser: this.isMoveUser,
      userTeam: this.userTeam,
      aiTeam: this.aiTeam,
      positionedCharacters: this.positionedCharacters.positions,
    };

    localStorage.setItem('storage', JSON.stringify(storage));
  }

  load() {
    const storage = JSON.parse(localStorage.getItem('storage'));

    if (!storage) {
      GamePlay.showError('Нет сохраненной игры');
      return;
    }

    this.level = storage.level;
    this.score = storage.score;
    this.action = storage.action;
    this.isSelected = storage.isSelected;
    this.selectCell = storage.selectCell;
    this.isMoveUser = storage.isMoveUser;
    this.userTeam.team = storage.userTeam.team;
    this.aiTeam.team = storage.aiTeam.team;
    this.userTeam.id = storage.userTeam.id;
    this.aiTeam.id = storage.aiTeam.id;
    this.positionedCharacters.positions = storage.positionedCharacters;

    this.positionedCharacters.aiTeam = this.aiTeam;
    this.positionedCharacters.userTeam = this.userTeam;
    this.positionedCharacters.load();
  }
}
