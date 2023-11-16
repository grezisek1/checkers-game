import { Game } from "./modules/game.js";
import { Board, boardClasses } from "./modules/board.js";
import { State } from "./modules/state.js";
import { UI } from "./modules/ui.js";
import { Controller } from "./modules/controller.js";
import { Logic } from "./modules/logic.js";
import { SimplifiedTakeTree } from "./modules/takeTree.js";

const game = new Game({
  board: new Board(),
  state: new State(),
  ui: new UI(),
  logic: new Logic(SimplifiedTakeTree),
  controller: new Controller(),
});

game.init();

function simulateGames(howMany, stepDelay) {
  const pickPiece = () => {
    let pieceSet = [1, 3];
    if (game.state.currentPlayerIndex) {
      pieceSet[0] = 2;
      pieceSet[1] = 4;
    }

    const moveablePieces = [];
    const pieces = Array.from(document.querySelectorAll(`[data-state="${pieceSet[0]}"], [data-state="${pieceSet[1]}"]`));
    
    let di = -1;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        let ci = game.logic.xyToCi(x, y);
        if (!game.board.fields[ci].dataset.state) {
          continue;
        }
        di++;

        if (pieces.includes(game.board.fields[ci])) {
          if (game.logic.getAvailableMoves(game, di).length) {
            moveablePieces.push(ci);
          }
        }
      }
    }
    
    return moveablePieces[Math.floor(Math.random() * moveablePieces.length)];
  };

  const movePiece = (piece) => {
    game.board.fields[piece].click();
    const moves = Array.from(document.querySelectorAll(`.${boardClasses.highlighted}`));
    if (!moves.length) {
      console.error("should not happen?");
      return false;
    }
    moves[Math.floor(Math.random() * moves.length)].click();
    return true;
  };

  const step = () => {
    const piece = pickPiece();
    if (!piece) {
      return false;
    }
    return movePiece(piece);
  };

  let remainingGames = howMany;
  const makeSteps = () => {
    if (step()) {
      setTimeout(makeSteps, stepDelay);
      return;
    }
    remainingGames--;
    if (remainingGames) {
      winner.click();
      makeSteps();
    }
  };
  makeSteps();
}

simulateGames(50, 20);