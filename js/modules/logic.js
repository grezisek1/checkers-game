import { boardClasses } from "./board.js";
import { stateValues } from "./state.js";

const player1Pieces = [stateValues.piece1, stateValues.king1];
const player2Pieces = [stateValues.piece2, stateValues.king2];
const kings = [stateValues.king1, stateValues.king2];
const kingMoveDirections = [
    -1, -1, "fl",
    1, -1, "fr",
    -1, 1, "bl",
    1, 1, "br",
];

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
    getPieceAsKing(piece) {
        if (piece === stateValues.piece1) {
            return stateValues.king1;
        }

        return stateValues.king2;
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
    isPieceKing(piece) {
        return kings.includes(piece);
    }

    updateAnalysis(game) {
        if (game.state.currentPlayerIndex) {
            this.#updatePlayer(game, player2Pieces, player1Pieces, this.#updateP2PieceMoves, 8);
        } else {
            this.#updatePlayer(game, player1Pieces, player2Pieces, this.#updateP1PieceMoves, 1);
        }
    }
    #updatePlayer(game, playerPieces, enemyPieces, pieceMovesUpdater, kingCandidatesRow) {
        game.state.analysis.kingCandidates.length = 0;
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

                if (kings.includes(game.state.data[di])) {
                    this.#updateKingMoves(game.state, x, y, di, enemyPieces);
                } else {
                    pieceMovesUpdater.call(this, game.state, x, y, di);
                    if (y == kingCandidatesRow) {
                        game.state.analysis.kingCandidates.push(ci);
                    }
                }
            }
        }
    }

    #updateP1PieceMoves(state, x, y, di) {
        const nbhd = {
            fl: null, fr: null,
            bl: null, br: null,
        };
        this.#updateNBHD(state.data, nbhd, x, y);

        const movesWithoutTake = [];
        const movesWithTake = [];
        
        const _nbhd = Object.create(nbhd);
        if (nbhd.fl === stateValues.empty) {
            movesWithoutTake.push(this.xyToCi(x - 1, y - 1));
        } else if (player2Pieces.includes(nbhd.fl)) {
            this.#updateNBHD(state.data, _nbhd, x - 1, y - 1);
            if (_nbhd.fl === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x - 2, y - 2));
            }
        }
        if (nbhd.fr === stateValues.empty) {
            movesWithoutTake.push(this.xyToCi(x + 1, y - 1));
        } else if (player2Pieces.includes(nbhd.fr)) {
            this.#updateNBHD(state.data, _nbhd, x + 1, y - 1);
            if (_nbhd.fr === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x + 2, y - 2));
            }
        }

        if (player2Pieces.includes(nbhd.bl)) {
            this.#updateNBHD(state.data, _nbhd, x - 1, y + 1);
            if (_nbhd.bl === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x - 2, y + 2));
            }
        }
        if (player2Pieces.includes(nbhd.br)) {
            this.#updateNBHD(state.data, _nbhd, x + 1, y + 1);
            if (_nbhd.br === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x + 2, y + 2));
            }
        }

        if (movesWithTake.length) {

        } else {
            Array.prototype.push.apply(state.analysis.availableMoves[di], movesWithoutTake);
        }
    }
    #updateP2PieceMoves(state, x, y, di) {
        const nbhd = {
            fl: null, fr: null,
            bl: null, br: null,
        };
        this.#updateNBHD(state.data, nbhd, x, y);

        const movesWithoutTake = [];
        const movesWithTake = [];

        const _nbhd = Object.create(nbhd);
        if (nbhd.bl === stateValues.empty) {
            movesWithoutTake.push(this.xyToCi(x - 1, y + 1));

        } else if (player1Pieces.includes(nbhd.bl)) {
            this.#updateNBHD(state.data, _nbhd, x - 1, y + 1);
            if (_nbhd.bl === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x - 2, y + 2));
            }
        }

        if (nbhd.br === stateValues.empty) {
            movesWithoutTake.push(this.xyToCi(x + 1, y + 1));
                
        } else if (player1Pieces.includes(nbhd.br)) {
            this.#updateNBHD(state.data, _nbhd, x + 1, y + 1);
            if (_nbhd.br === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x + 2, y + 2));
            }
        }

        if (player1Pieces.includes(nbhd.fl)) {
            this.#updateNBHD(state.data, _nbhd, x - 1, y - 1);
            if (_nbhd.fl === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x - 2, y - 2));
            }
        }
        if (player1Pieces.includes(nbhd.fr)) {
            this.#updateNBHD(state.data, _nbhd, x + 1, y - 1);
            if (_nbhd.bl === stateValues.empty) {
                movesWithTake.push(this.xyToCi(x + 2, y - 2));
            }
        }

        if (movesWithTake.length) {

        } else {
            Array.prototype.push.apply(state.analysis.availableMoves[di], movesWithoutTake);
        }
    }

    #updateKingMoves(state, x, y, di, enemyPieces) {
        const nbhd = {
            fl: null, fr: null,
            bl: null, br: null,
        };

        const movesWithoutTake = [];
        const movesWithTake = [];

        for (let dir = 0; dir < 4 * 3; dir += 3) {
            this.#updateNBHD(state.data, nbhd, x, y);
            this.#updateKingMovesInDirection(
                state, nbhd, x, y,
                kingMoveDirections[dir],
                kingMoveDirections[dir+1],
                kingMoveDirections[dir+2],
                enemyPieces,
                movesWithoutTake,
                movesWithTake
            );
        }
        
        if (movesWithTake.length) {

        } else {
            Array.prototype.push.apply(state.analysis.availableMoves[di], movesWithoutTake);
        }
    }
    #updateKingMovesInDirection(state, nbhd, x, y, dirX, dirY, dirKey, enemyPieces, movesWithoutTake, movesWithTake) {
        let nx = x + dirX;
        let ny = y + dirY;
        this.#updateNBHD(state.data, nbhd, x, y);
        while (nbhd[dirKey] === stateValues.empty) {
            movesWithoutTake.push(this.xyToCi(nx, ny));
            this.#updateNBHD(state.data, nbhd, nx, ny);
            nx += dirX;
            ny += dirY;
        }
        if (enemyPieces.includes(nbhd[dirKey])) {
            this.#updateNBHD(state.data, nbhd, nx, ny);
            while (nbhd[dirKey] === stateValues.empty) {
                nx += dirX;
                ny += dirY;
                movesWithTake.push(this.xyToCi(nx, ny));
                this.#updateNBHD(state.data, nbhd, nx, ny);
            }
        }
    }

    #updateNBHD(boardData, nbhd, x, y) {
        if (y >= 1) {
            if (x >= 1) {
                nbhd.fl = boardData[this.xyToDi(x - 1, y - 1)];
            } else {
                nbhd.fl = null;
            }
            if (x < 9) {
                nbhd.fr = boardData[this.xyToDi(x + 1, y - 1)];
            } else {
                nbhd.fr = null;
            }
        } else {
            nbhd.fl = null;
            nbhd.fr = null;
        }
        if (y < 9) {
            if (x >= 1) {
                nbhd.bl = boardData[this.xyToDi(x - 1, y + 1)];
            } else {
                nbhd.bl = null;
            }
            if (x < 9) {
                nbhd.br = boardData[this.xyToDi(x + 1, y + 1)];
            } else {
                nbhd.br = null;
            }
        } else {
            nbhd.bl = null;
            nbhd.br = null;
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