import { stateValues } from "./state.js";

const noFields = [];

export class Controller {
    initController(game) {
        this.#startGame(game);
        winner.addEventListener("click", () => {
            game.ui.hideWinner();
            this.#startGame(game);
        });

        board.addEventListener("click", clickEvent => {
            this.#clickField(game, clickEvent);
        }, true);
    }

    #startGame(game) {
        this.#resetState(game);
        this.#updateBoard(game);
        this.#updateUI(game);
        this.#updateLogic(game);
    }

    #endGame(game) {
        game.ui.setWinner(game.state.currentPlayerIndex);
        game.ui.showWinner();
    }

    #resetState(game) {
        new Uint8Array(game.state.data.buffer, 0, 15).fill(stateValues.piece2);
        new Uint8Array(game.state.data.buffer, 15, 20).fill(stateValues.empty);
        new Uint8Array(game.state.data.buffer, 35, 15).fill(stateValues.piece1);
        game.state.score.fill(0);
        game.state.currentPlayerIndex = 0;

        new Uint8Array(game.state.data.buffer, 35, 1).fill(stateValues.king1);
        new Uint8Array(game.state.data.buffer, 14, 1).fill(stateValues.king2);
    }

    #updateBoard(game) {
        let ci = 0;
        let di = -1;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (!game.logic.isXYUsable(x, y)) {
                    continue;
                }
                ci = game.logic.xyToCi(x, y);
                di++;
                board.children[ci].dataset.state = game.state.data[di].toString();
            }
        }
    }

    #updateUI(game) {
        game.ui.setTurn(game.state.currentPlayerIndex);
        game.ui.setScore(game.state.score);
    }

    #updateLogic(game) {
        game.logic.updateAnalysis(game);
    }

    #clickField(game, clickEvent) {
        if (!game.logic.isFieldUsable(clickEvent.target)) {
            game.board.highlightFields(noFields);
            game.board.selectFields(noFields);
            game.state.selected = null;
            return;
        }
        
        const ci = game.board.fields.indexOf(clickEvent.target);
        const di = game.logic.ciToDi(ci);

        if (game.logic.isClickMovement(clickEvent)) {
            const taken = game.logic.getTaken(game.state, ci);

            // TODO: taking sometimes fails to remove the taken piece
            if (taken && game.state.data[taken] == stateValues.empty) {
                throw new Error("failed to remove the taken piece");
            }

            if (taken) {
                game.state.data[taken] = stateValues.empty;
                game.state.score[game.state.currentPlayerIndex]++;
                if (game.logic.isGameOver(game)) {
                    this.#endGame(game);
                }
            }
            this.#movePiece(game, di);
            return;
        }

        const availableMoves = game.logic.getAvailableMoves(game, di);
        game.board.highlightFields(availableMoves);

        if (availableMoves.length) {
            game.board.selectFields([ci]);
            game.state.selected = ci;
        } else {
            game.board.selectFields(noFields);
            game.state.selected = null;
        }
    }

    #movePiece(game, di) {
        const selectedDi = game.logic.ciToDi(game.state.selected);
        game.state.data[di] = game.state.data[selectedDi];
        game.state.data[selectedDi] = stateValues.empty;
        
        game.state.currentPlayerIndex = (game.state.currentPlayerIndex + 1) % 2;
        
        if (!game.logic.isPieceKing(game.state.data[di])) {
            if (game.logic.getKingCandidates(game).includes(game.state.selected)) {
                game.state.data[di] = game.logic.getPieceAsKing(game.state.data[di]);
            }
        }
        
        this.#updateBoard(game);
        this.#updateUI(game);
        this.#updateLogic(game);
        game.board.highlightFields(noFields);
        game.board.selectFields(noFields);
    }
}