class TakeNode {
    constructor(take) {
        this.root = take;
    }
}

export default class SimplifiedTakeTree {
    #game = null;
    constructor(game) {
        this.#game = game;
    }

    updateTakes(x, y, movesWithTakes) {
        const di = this.#game.logic.xyToDi(x, y);
        for (let take of movesWithTakes) {
            this.#game.state.takes[di]
                .push(new TakeNode(take));
        }
    }
}