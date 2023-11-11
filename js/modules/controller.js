import { stateValues } from "./state.js";

const noFields = [];

export class Controller {
    initController(game) {
        this.startGame(game);
        winner.addEventListener("click", () => {
            game.ui.hideWinner();
            this.startGame(game);
        });

        board.addEventListener("click", clickEvent => {
            this.clickField(game, clickEvent);
        }, true);
    }

    startGame(game) {
        this.resetState(game);
        this.updateBoard(game);
        this.updateUI(game);
        this.updateLogic(game);
    }

    endGame(game) {
        game.ui.setWinner(game.state.currentPlayerIndex);
        game.ui.showWinner();
    }

    resetState(game) {
        new Uint8Array(game.state.data.buffer, 0, 15).fill(stateValues.piece2);
        new Uint8Array(game.state.data.buffer, 15, 20).fill(stateValues.empty);
        new Uint8Array(game.state.data.buffer, 35, 15).fill(stateValues.piece1);
        game.state.score.fill(0);
        game.state.currentPlayerIndex = 0;
    }

    updateBoard(game) {
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

    updateUI(game) {
        game.ui.setTurn(game.state.currentPlayerIndex);
        game.ui.setScore(game.state.score);
    }

    updateLogic(game) {
        game.logic.updateAnalysis(game);
    }

    clickField(game, clickEvent) {
        if (!game.logic.isFieldUsable(clickEvent.target)) {
            game.board.highlightFields(noFields);
            game.board.selectFields(noFields);
            game.state.selected = null;
            return;
        }
        
        const ci = game.board.fields.indexOf(clickEvent.target);
        if (game.logic.isClickMovement(clickEvent)) {
            this.movePiece(game, ci);
            return;
        }

        const di = game.logic.ciToDi(ci);
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

    movePiece(game, ci) {
        const selectedDi = game.logic.ciToDi(game.state.selected);
        const di = game.logic.ciToDi(ci);
        game.state.data[di] = game.state.data[selectedDi];
        game.state.data[selectedDi] = stateValues.empty;
        game.board.fields[ci].dataset.state = game.board.fields[game.state.selected].dataset.state;
        game.board.fields[game.state.selected].dataset.state = stateValues.empty.toString();
        
        game.state.currentPlayerIndex = (game.state.currentPlayerIndex + 1) % 2;
        
        this.updateUI(game);
        this.updateLogic(game);
        game.board.highlightFields(noFields);
        game.board.selectFields(noFields);

        console.log(`Player ${2 - game.state.currentPlayerIndex} moved`);
    }
}