export const stateValues = {
    empty: 0,
    piece1: 1,
    piece2: 2,
    king1: 3,
    king2: 4,
};

export class State {
    initState() {
        this.data = new Uint8Array(50); // half of total is usable
        this.score = new Uint8Array(2);
        this.currentPlayerIndex = 0;
        this.selected = null;
        this.analysis = {
            availableMoves: new Array(50).fill(null).map(_=>[]),
            kingCandidates: [],
            takes: new Array(50).fill(null).map(_=>[]),
        };
    }
}