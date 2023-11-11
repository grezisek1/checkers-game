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

function testGameReset(winnerIndex) {
  game.state.currentPlayerIndex = winnerIndex;
  const winnerPiece = winnerIndex ? stateValues.king2 : stateValues.king1;
  game.state.data[0] = winnerPiece;
  for (let i = 1; i < 50; i++) {
    if (Math.random() < 0.9) {
      game.state.data[i] = stateValues.empty;
      continue;
    }
    
    game.state.data[i] = winnerPiece;
  }
  game.controller.updateBoard(game);

  game.state.score[0] = Math.floor(Math.random() * 5);
  game.state.score[1] = Math.floor(Math.random() * 5);
  
  game.controller.updateUI(game);
  
  game.controller.endGame(game);
}

testGameReset(1); // player two
// testGameReset(0); // player one