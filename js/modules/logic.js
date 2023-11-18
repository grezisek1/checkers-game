import {
    fieldClasses,
    stateValues,
    player1Pieces,
    player2Pieces,
    kings,
    kingMoveDirections,
    kingCandidateRows,
    piecesCount,
    fieldsCount
} from "./constants.js";


function updatePlayer(game, playerPieces, enemyPieces, pieceMovesUpdater, kingCandidatesRow, takeStrategy) {
    game.state.kingCandidates.length = 0;
    let di = -1;
    const size = Math.sqrt(fieldsCount);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let ci = xyToCi(x, y);
            if (!game.fields.list[ci].dataset.state) {
                continue;
            }

            di++;
            game.state.availableMoves[di].length = 0;
            game.state.takes[di].length = 0;

            if (!playerPieces.includes(game.state.data[di])) {
                continue;
            }

            if (kings.includes(game.state.data[di])) {
                updateKingMoves(game.state, x, y, di, enemyPieces, takeStrategy);
            } else {
                pieceMovesUpdater.call(this, game.state, x, y, di, takeStrategy);
                if (y == kingCandidatesRow) {
                    game.state.kingCandidates.push(ci);
                }
            }
        }
    }
}
function updateKingMoves(state, x, y, di, enemyPieces, takeStrategy) {
    const nbhd = {
        fl: null, fr: null,
        bl: null, br: null,
    };

    const movesWithoutTake = [];
    const movesWithTake = [];

    for (let dir = 0; dir < 4 * 3; dir += 3) {
        updateNBHD(state.data, nbhd, x, y);
        updateKingMovesInDirection(
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
        takeStrategy.updateTakes(x, y, movesWithTake);
        for (let take of movesWithTake) {
            state.availableMoves[di].push(take[0]);
        }

    } else {
        Array.prototype.push.apply(state.availableMoves[di], movesWithoutTake);
    }
}
function updateKingMovesInDirection(state, nbhd, x, y, dirX, dirY, dirKey, enemyPieces, movesWithoutTake, movesWithTake) {
    let nx = x + dirX;
    let ny = y + dirY;
    updateNBHD(state.data, nbhd, x, y);
    while (nbhd[dirKey] === stateValues.empty) {
        movesWithoutTake.push(xyToCi(nx, ny));
        updateNBHD(state.data, nbhd, nx, ny);
        nx += dirX;
        ny += dirY;
    }
    if (enemyPieces.includes(nbhd[dirKey])) {
        const takenDi = xyToDi(nx, ny);
        updateNBHD(state.data, nbhd, nx, ny);
        while (nbhd[dirKey] === stateValues.empty) {
            nx += dirX;
            ny += dirY;
            
            movesWithTake.push([xyToCi(nx, ny), takenDi]);
            updateNBHD(state.data, nbhd, nx, ny);
        }
    }
}

function updateNBHD(boardData, nbhd, x, y) {
    if (y >= 1) {
        if (x >= 1) {
            nbhd.fl = boardData[xyToDi(x - 1, y - 1)];
        } else {
            nbhd.fl = null;
        }
        if (x < 9) {
            nbhd.fr = boardData[xyToDi(x + 1, y - 1)];
        } else {
            nbhd.fr = null;
        }
    } else {
        nbhd.fl = null;
        nbhd.fr = null;
    }
    if (y < 9) {
        if (x >= 1) {
            nbhd.bl = boardData[xyToDi(x - 1, y + 1)];
        } else {
            nbhd.bl = null;
        }
        if (x < 9) {
            nbhd.br = boardData[xyToDi(x + 1, y + 1)];
        } else {
            nbhd.br = null;
        }
    } else {
        nbhd.bl = null;
        nbhd.br = null;
    }
}

function xyToCi(x, y) {
    return y * 10 + x;
}
function ciToDi(ci) {
    return Math.floor(ci / 2);
}
export function xyToDi(x, y) {
    return Math.floor(y * 5 + x / 2);
}
export function diToXy(di) {
    const y = Math.floor(di / 5);
    const x = (di % 5) * 2 + (y + 1) % 2;
    return [x, y];
}

function updateP1PieceMoves(state, x, y, di, takeStrategy) {
    const nbhd = {
        fl: null, fr: null,
        bl: null, br: null,
    };
    updateNBHD(state.data, nbhd, x, y);

    const movesWithoutTake = [];
    const movesWithTake = [];
    
    const _nbhd = Object.create(nbhd);
    if (nbhd.fl === stateValues.empty) {
        movesWithoutTake.push(xyToCi(x - 1, y - 1));
    } else if (player2Pieces.includes(nbhd.fl)) {
        updateNBHD(state.data, _nbhd, x - 1, y - 1);
        if (_nbhd.fl === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x - 2, y - 2),
                xyToDi(x - 1, y - 1)
            ]);
        }
    }
    if (nbhd.fr === stateValues.empty) {
        movesWithoutTake.push(xyToCi(x + 1, y - 1));
    } else if (player2Pieces.includes(nbhd.fr)) {
        updateNBHD(state.data, _nbhd, x + 1, y - 1);
        if (_nbhd.fr === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x + 2, y - 2),
                xyToDi(x + 1, y - 1)
            ]);
        }
    }

    if (player2Pieces.includes(nbhd.bl)) {
        updateNBHD(state.data, _nbhd, x - 1, y + 1);
        if (_nbhd.bl === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x - 2, y + 2),
                xyToDi(x - 1, y + 1)
            ]);
        }
    }
    if (player2Pieces.includes(nbhd.br)) {
        updateNBHD(state.data, _nbhd, x + 1, y + 1);
        if (_nbhd.br === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x + 2, y + 2),
                xyToDi(x + 1, y + 1)
            ]);
        }
    }

    if (movesWithTake.length) {
        takeStrategy.updateTakes(x, y, movesWithTake);
        for (let take of movesWithTake) {
            state.availableMoves[di].push(take[0]);
        }
    } else {
        Array.prototype.push.apply(state.availableMoves[di], movesWithoutTake);
    }
}
function updateP2PieceMoves(state, x, y, di, takeStrategy) {
    const nbhd = {
        fl: null, fr: null,
        bl: null, br: null,
    };
    updateNBHD(state.data, nbhd, x, y);

    const movesWithoutTake = [];
    const movesWithTake = [];

    const _nbhd = Object.create(nbhd);
    if (nbhd.bl === stateValues.empty) {
        movesWithoutTake.push(xyToCi(x - 1, y + 1));

    } else if (player1Pieces.includes(nbhd.bl)) {
        updateNBHD(state.data, _nbhd, x - 1, y + 1);
        if (_nbhd.bl === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x - 2, y + 2),
                xyToDi(x - 1, y + 1)
            ]);
        }
    }

    if (nbhd.br === stateValues.empty) {
        movesWithoutTake.push(xyToCi(x + 1, y + 1));
            
    } else if (player1Pieces.includes(nbhd.br)) {
        updateNBHD(state.data, _nbhd, x + 1, y + 1);
        if (_nbhd.br === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x + 2, y + 2),
                xyToDi(x + 1, y + 1)
            ]);
        }
    }

    if (player1Pieces.includes(nbhd.fl)) {
        updateNBHD(state.data, _nbhd, x - 1, y - 1);
        if (_nbhd.fl === stateValues.empty) {
            movesWithTake.push([
                xyToCi(x - 2, y - 2),
                xyToDi(x - 1, y - 1)
            ]);
        }
    }
    if (player1Pieces.includes(nbhd.fr)) {
        updateNBHD(state.data, _nbhd, x + 1, y - 1);
        if (_nbhd.bl === stateValues.empty) {
            movesWithTake.push([
                this.xyToCi(x + 2, y - 2),
                this.xyToDi(x + 1, y - 1)
            ]);
        }
    }

    if (movesWithTake.length) {
        takeStrategy.updateTakes(x, y, movesWithTake);
        for (let take of movesWithTake) {
            state.availableMoves[di].push(take[0]);
        }
    } else {
        Array.prototype.push.apply(state.availableMoves[di], movesWithoutTake);
    }
}

export default class Logic {
    #takeStrategyClass = null;
    #takeStrategy = null;
    constructor(takeStrategyClass) {
        this.#takeStrategyClass = takeStrategyClass;
    }
    initLogic(game) {
        this.#takeStrategy = new this.#takeStrategyClass(game);
        this.updateAnalysis(game);
    }

    getAvailableMoves(game, di) {
        return game.state.availableMoves[di];
    }
    getKingCandidates(game) {
        return game.state.kingCandidates;
    }
    getPieceAsKing(piece) {
        if (piece === stateValues.piece1) {
            return stateValues.king1;
        }

        return stateValues.king2;
    }

    isClickMovement(clickEvent) {
        return clickEvent.target.classList.contains(fieldClasses.highlighted);
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
    isGameOver(game) {
        return game.state.score[game.state.currentPlayerIndex] == piecesCount;
    }
    getTaken(state, ci) {
        const fromDi = this.ciToDi(state.selected);
        for (let take of state.takes[fromDi]) {
            if (take.root[0] === ci) {
                return take.root[1];
            }
        }

        return null;
    }
    updateAnalysis(game) {
        if (game.state.currentPlayerIndex) {
            updatePlayer(game, player2Pieces, player1Pieces, updateP2PieceMoves, kingCandidateRows[1], this.#takeStrategy);
        } else {
            updatePlayer(game, player1Pieces, player2Pieces, updateP1PieceMoves, kingCandidateRows[0], this.#takeStrategy);
        }
    }

    xyToCi = xyToCi;
    ciToDi = ciToDi;
    xyToDi = xyToDi;
}