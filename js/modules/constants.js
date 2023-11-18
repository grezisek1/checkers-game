export const fieldClasses = {
    field: "field",
    selected: "field--selected",
    highlighted: "field--highlighted",
};

export const stateValues = {
    empty: 0,
    piece1: 1,  piece2: 2,
    king1: 3,   king2: 4,
};

export const fieldsCount = 100;
export const dataCount = 50;
export const piecesCount = 20;
export const autoplaySpeed = 300;
export const fieldNodeName = "button";
export const pieceNodeName = "game-piece";
export const boardNode = board;
export const player1Pieces = [stateValues.piece1, stateValues.king1];
export const player2Pieces = [stateValues.piece2, stateValues.king2];
export const kings = [stateValues.king1, stateValues.king2];
export const kingMoveDirections = [
    -1, -1, "fl",    1, -1, "fr",
    -1,  1, "bl",    1,  1, "br",
];
export const kingCandidateRows = [1, 8];

export const piecesColors = ["white", "black"];
export const piecesTypes = ["piece", "king"];
export const xVar = "--x";
export const yVar = "--y";
