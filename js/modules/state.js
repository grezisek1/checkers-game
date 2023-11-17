export const stateValues = {
    empty: 0,
    piece1: 1,
    piece2: 2,
    king1: 3,
    king2: 4,
};

export default class State {
    constructor() {
        this.data = new Uint8Array(50);
        this.score = new Uint8Array(2);
        this.currentPlayerIndex = 0;
        this.selected = null;
        this.availableMoves = new Array(50).fill(null).map(_=>[]);
        this.kingCandidates = [];
        this.takes = new Array(50).fill(null).map(_=>[]);
    }
}