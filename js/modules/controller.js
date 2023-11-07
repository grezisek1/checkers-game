import { stateValues } from "./state.js";

export class Controller {
    startGame(game) {
        this.resetState(game);
        this.updateBoard(game);
        this.updateTurn(game);
        this.updateScore(game);
    }

    resetState(game) {
        new Uint8Array(game.state.data.buffer, 0, 15).fill(stateValues.piece1);
        new Uint8Array(game.state.data.buffer, 15, 20).fill(stateValues.empty);
        new Uint8Array(game.state.data.buffer, 35, 15).fill(stateValues.piece2);
        game.state.isPlayer1Turn = true;
    }

    updateBoard(game) {
        let ci = 0;
        let di = 0;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x+=2) {
                ci = 99 - (y * 10 + (y + 1) % 2 + x);
                board.children[ci].dataset.state = game.state.data[di].toString();
                di++;
            }
        }
    }

    updateTurn(game) {
        const playerIndex = game.state.isPlayer1Turn ? 0 : 1;
        game.ui.setTurn(playerIndex);
    }

    updateScore(game) {
        game.ui.setScore(game.state.score);
    }
}