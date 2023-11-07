export class Game {
  constructor(modules) {
    this.board = modules.board;
    this.state = modules.state;
    this.ui = modules.ui;
    this.controller = modules.controller;
  }

  init() {
    this.board.initBoard();
    this.state.initState();
    this.controller.startGame(this);
  }
}
