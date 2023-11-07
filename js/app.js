import { Game } from "./modules/game.js";
import { Board } from "./modules/board.js";
import { State } from "./modules/state.js";
import { UI } from "./modules/ui.js";
import { Controller } from "./modules/controller.js";

const game = new Game({
  board: new Board(),
  state: new State(),
  ui: new UI(),
  controller: new Controller(),
});

game.init();