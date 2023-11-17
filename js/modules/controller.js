import { stateValues } from "./state.js";

const noFields = [];

function startGame(game) {
    new Uint8Array(game.state.data.buffer, 0, 15).fill(stateValues.piece2);
    new Uint8Array(game.state.data.buffer, 15, 20).fill(stateValues.empty);
    new Uint8Array(game.state.data.buffer, 35, 15).fill(stateValues.piece1);
    game.state.score.fill(0);
    game.state.currentPlayerIndex = 0;
    game.ui.setTurn(game.state.currentPlayerIndex);
    game.ui.setScore(game.state.score);
    updateFields(game);
    game.logic.updateAnalysis(game);
}
function endGame(game) {
    game.ui.setWinner(game.state.currentPlayerIndex);
    game.ui.showWinner();
}
function updateFields(game) {
    let ci = 0;
    let di = -1;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (!game.logic.isXYUsable(x, y)) {
                continue;
            }
            ci = game.logic.xyToCi(x, y);
            di++;
            game.fields.list[ci].dataset.state = game.state.data[di].toString();
        }
    }
}

function clickField(game, clickEvent) {
    if (!game.logic.isFieldUsable(clickEvent.target)) {
        game.fields.highlightFields(noFields);
        game.fields.selectFields(noFields);
        game.state.selected = null;
        return;
    }
    
    const ci = game.fields.list.indexOf(clickEvent.target);
    const di = game.logic.ciToDi(ci);

    if (game.logic.isClickMovement(clickEvent)) {
        const taken = game.logic.getTaken(game.state, ci);
        if (taken) {
            game.state.data[taken] = stateValues.empty;
            game.state.score[game.state.currentPlayerIndex]++;
            if (game.logic.isGameOver(game)) {
                endGame(game);
            }
        }
        movePiece(game, di);
        return;
    }

    const availableMoves = game.logic.getAvailableMoves(game, di);
    game.fields.highlightFields(availableMoves);

    if (availableMoves.length) {
        game.fields.selectFields([ci]);
        game.state.selected = ci;
    } else {
        game.fields.selectFields(noFields);
        game.state.selected = null;
    }
}

function movePiece(game, di) {
    const selectedDi = game.logic.ciToDi(game.state.selected);
    game.state.data[di] = game.state.data[selectedDi];
    game.state.data[selectedDi] = stateValues.empty;
    game.state.currentPlayerIndex = (game.state.currentPlayerIndex + 1) % 2;
    
    if (!game.logic.isPieceKing(game.state.data[di])) {
        if (game.logic.getKingCandidates(game).includes(game.state.selected)) {
            game.state.data[di] = game.logic.getPieceAsKing(game.state.data[di]);
        }
    }
    updateFields(game);
    game.ui.setTurn(game.state.currentPlayerIndex);
    game.ui.setScore(game.state.score);
    game.logic.updateAnalysis(game);
    game.fields.highlightFields(noFields);
    game.fields.selectFields(noFields);
}

export default class Controller {
    initController(game) {
        startGame(game);
        winner.addEventListener("click", () => {
            game.ui.hideWinner();
            startGame(game);
        });

        game.fields.node.addEventListener("click", clickEvent => {
            clickField(game, clickEvent);
        }, true);
    }
}