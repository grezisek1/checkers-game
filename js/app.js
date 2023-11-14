import { Game } from "./modules/game.js";
import { Board } from "./modules/board.js";
import { State, stateValues } from "./modules/state.js";
import { UI } from "./modules/ui.js";
import { Controller } from "./modules/controller.js";
import { Logic } from "./modules/logic.js";

const game = new Game({
  board: new Board(),
  state: new State(),
  ui: new UI(),
  logic: new Logic(),
  controller: new Controller(),
});

game.init();