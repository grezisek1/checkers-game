import { fieldClasses } from "./constants.js";

let cancel = false;
export default function autoplay(game, howManyGames, turnDelay) {
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
                if (!game.fields.list[ci].dataset.state) {
                    continue;
                }
                di++;

                if (pieces.includes(game.fields.list[ci])) {
                    if (game.logic.getAvailableMoves(game, di).length) {
                        moveablePieces.push(ci);
                    }
                }
            }
        }

        return moveablePieces[Math.floor(Math.random() * moveablePieces.length)];
    };

    const movePiece = (piece) => {
        game.fields.list[piece].click();
        const moves = Array.from(document
            .querySelectorAll(`.${fieldClasses.highlighted}`));

        moves[Math.floor(Math.random() * moves.length)].click();
        return true;
    };

    const turn = () => {
        const piece = pickPiece();
        if (!piece) {
            return false;
        }
        return movePiece(piece);
    };

    const nextGame = () => {
        winner.click();
        doTurns();
    };

    let remainingGames = howManyGames;
    const doTurns = () => {
        if (cancel) {
            cancel = false;
            return;
        }
        if (turn()) {
            setTimeout(doTurns, turnDelay);
            return;
        }
        remainingGames--;
        if (remainingGames) {
            setTimeout(nextGame, 1000);
        }
    };
    doTurns();
}

export function cancelAutoplay() {
    cancel = true;
}