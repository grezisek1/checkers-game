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
        this.score = new Float64Array(2);
        this.isPlayer1Turn = null;
        console.log("State initialized");
    }
}