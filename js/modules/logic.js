import { boardClasses } from "./board.js";
import { stateValues } from "./state.js";

const player1Pieces = [stateValues.piece1, stateValues.king1];
const player2Pieces = [stateValues.piece2, stateValues.king2];

export class Logic {
    initLogic(game) {
        this.updateAnalysis(game);
    }

    getAvailableMoves(game, di) {
        return game.state.analysis.availableMoves[di];
    }
    getKingCandidates(game) {
        return game.state.analysis.kingCandidates;
    }

    isClickMovement(clickEvent) {
        return clickEvent.target.classList.contains(boardClasses.highlighted);
    }
    isFieldUsable(fieldNode) {
        return Boolean(fieldNode.dataset.state);
    }
    isXYUsable(x, y) {
        return !Boolean((y + 1) % 2 - x % 2);
    }

    updateAnalysis(game) {
        if (game.state.currentPlayerIndex) {
            this.updatePlayer(game, player2Pieces, this.updateP2PieceMoves);
        } else {
            this.updatePlayer(game, player1Pieces, this.updateP1PieceMoves);
        }
    }
    updatePlayer(game, playerPieces, pieceMovesUpdater) {
        const nbhd = {
            fl: null,
            fr: null,
            bl: null,
            br: null
        };
        let di = -1;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                let ci = this.xyToCi(x, y);
                if (!game.board.fields[ci].dataset.state) {
                    continue;
                }

                di++;
                game.state.analysis.availableMoves[di].length = 0;

                if (!playerPieces.includes(game.state.data[di])) {
                    continue;
                }

                nbhd.fl = nbhd.fr = nbhd.bl = nbhd.br = null;

                this.updateNBHD(game.state.data, nbhd, x, y);
                pieceMovesUpdater.call(this, game.state, nbhd, x, y, di);
            }
        }
    }
    updateNBHD(boardData, nbhd, x, y) {
        if (y >= 1) {
            if (x >= 1) {
                nbhd.fl = boardData[this.xyToDi(x - 1, y - 1)];
            }
            if (x < 9) {
                nbhd.fr = boardData[this.xyToDi(x + 1, y - 1)];
            }
        }
        if (y < 9) {
            if (x >= 1) {
                nbhd.bl = boardData[this.xyToDi(x - 1, y + 1)];
            }
            if (x < 9) {
                nbhd.br = boardData[this.xyToDi(x + 1, y + 1)];
            }
        }
    }
    updateP1PieceMoves(state, nbhd, x, y, di) {
        if (nbhd.fl !== null) {
            if (nbhd.fl == stateValues.empty) {
                state.analysis.availableMoves[di]
                    .push(this.xyToCi(x - 1, y - 1));

            } else if (player2Pieces.includes(nbhd.fl)) {

            }
        }

        if (nbhd.fr !== null) {
            if (nbhd.fr == stateValues.empty) {
                state.analysis.availableMoves[di]
                    .push(this.xyToCi(x + 1, y - 1));
                    
            } else if (player2Pieces.includes(nbhd.fr)) {

            }
        }

        if (state.data[di] == stateValues.king1) {
            if (nbhd.bl !== null) {
                if (nbhd.bl == stateValues.empty) {
                    state.analysis.availableMoves[di]
                        .push(this.xyToCi(x - 1, y + 1));
                }
            }
            if (nbhd.br !== null) {
                if (nbhd.br == stateValues.empty) {
                    state.analysis.availableMoves[di]
                        .push(this.xyToCi(x + 1, y + 1));
                }
            }
        }
    }
    updateP2PieceMoves(state, nbhd, x, y, di) {
        if (nbhd.bl !== null) {
            if (nbhd.bl == stateValues.empty) {
                state.analysis.availableMoves[di]
                    .push(this.xyToCi(x - 1, y + 1));

            } else if (player1Pieces.includes(nbhd.bl)) {

            }
        }

        if (nbhd.br !== null) {
            if (nbhd.br == stateValues.empty) {
                state.analysis.availableMoves[di]
                    .push(this.xyToCi(x + 1, y + 1));
                    
            } else if (player1Pieces.includes(nbhd.br)) {

            }
        }

        if (state.data[di] == stateValues.king1) {
            if (nbhd.fl !== null) {
                if (nbhd.fl == stateValues.empty) {
                    state.analysis.availableMoves[di]
                        .push(this.xyToCi(x - 1, y - 1));
                }
            }
            if (nbhd.fr !== null) {
                if (nbhd.fr == stateValues.empty) {
                    state.analysis.availableMoves[di]
                        .push(this.xyToCi(x + 1, y - 1));
                }
            }
        }
    }

    xyToCi(x, y) {
        return y * 10 + x;
    }
    ciToDi(ci) {
        return Math.floor(ci / 2);
    }
    xyToDi(x, y) {
        return this.ciToDi(this.xyToCi(x, y));
    }
}