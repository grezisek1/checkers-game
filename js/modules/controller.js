import { stateValues, boardNode, piecesCount, dataCount, fieldsCount, autoplaySpeed } from "./constants.js";
import autoplay, { cancelAutoplay } from "./autoplay.js";

const noFields = [];

function startGame(game) {
    new Uint8Array(game.state.data.buffer, 0, piecesCount).fill(stateValues.piece2);
    new Uint8Array(game.state.data.buffer, piecesCount, dataCount - 2 * piecesCount).fill(stateValues.empty);
    new Uint8Array(game.state.data.buffer, piecesCount + dataCount - 2 * piecesCount, piecesCount).fill(stateValues.piece1);
    game.state.score.fill(0);
    game.state.currentPlayerIndex = 0;
    game.ui.setTurn(game.state.currentPlayerIndex);
    game.ui.setScore(game.state.score);
    game.pieces.resetAll();
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
    const size = Math.sqrt(fieldsCount);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (!game.logic.isXYUsable(x, y)) {
                continue;
            }
            ci = game.logic.xyToCi(x, y);
            di++;
            game.fields.list[ci].dataset.state = game.state.data[di].toString();
        }
    }
}

const clickFieldSelected = [];
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
            game.pieces.take(taken);
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
        game.state.selected = ci;
        clickFieldSelected[0] = ci;
        game.fields.selectFields(clickFieldSelected);
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
    game.pieces.move(selectedDi, di);

    if (!game.logic.isPieceKing(game.state.data[di])) {
        if (game.logic.getKingCandidates(game).includes(game.state.selected)) {
            game.state.data[di] = game.logic.getPieceAsKing(game.state.data[di]);
            game.pieces.promote(di);
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

        autoplay_toggler.addEventListener("change", _ => {
            if (autoplay_toggler.checked) {
                autoplay(game, Infinity, autoplaySpeed);
            } else {
                cancelAutoplay();
            }
        });

        boardNode.addEventListener("click", clickEvent => {
            clickField(game, clickEvent);
        }, true);
    }
}