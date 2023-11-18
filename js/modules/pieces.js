import { piecesCount, pieceNodeName, boardNode, xVar, yVar, dataCount, stateValues, piecesColors, piecesTypes } from "./constants.js";
import { diToXy } from "./logic.js";

const attributeChangeHandlers = {
    "data-x": function(x) {
        this.style.setProperty(xVar, x);
    },
    "data-y": function(y) {
        this.style.setProperty(yVar, y);
    }
};

class GamePiece extends HTMLElement {
    static manager = null;
    static observedAttributes = ["data-x", "data-y"];
    constructor() {
        super();
        this.dataset.type = piecesTypes[0];
        if (boardNode.contains(this)) {
            if (GamePiece.manager.pieces[0].includes(this)) {
                this.dataset.color = piecesColors[0];
            } else {
                this.dataset.color = piecesColors[1];
            }
        }
    }

    attributeChangedCallback(name, _, newValue) {
        attributeChangeHandlers[name].call(this, parseInt(newValue));
    }
}

const xytemp = new Uint8Array(2);
export default class Pieces {
    #piecesDiLUT = new Array(dataCount).fill(null);
    constructor() {
        this.pieces = [
            new Array(piecesCount),
            new Array(piecesCount),
        ];
        
        let di;
        for (let i = 0; i < piecesCount; i++) {
            di = i;
            this.pieces[1][i] = document.createElement(pieceNodeName);
            this.#piecesDiLUT[di] = this.pieces[1][i];
            this.move(di, di);
            
            di = i + dataCount - piecesCount;
            this.pieces[0][i] = document.createElement(pieceNodeName);
            this.#piecesDiLUT[di] = this.pieces[0][i];
            this.move(di, di);
        }

        boardNode.append.apply(boardNode, this.pieces[1]);
        boardNode.append.apply(boardNode, this.pieces[0]);

        GamePiece.manager = this;
        customElements.define(pieceNodeName, GamePiece);
    }

    move(from, to) {
        if (this.#piecesDiLUT[from] === null) {
            throw new Error("Trying to move the empty field");
        }
        if (this.#piecesDiLUT[to] !== null && from !== to) {
            throw new Error("Trying to move into occupied field");
        }

        xytemp.set(diToXy(to));
        this.#piecesDiLUT[from].dataset.x = xytemp[0];
        this.#piecesDiLUT[from].dataset.y = xytemp[1];
        if (from !== to) {
            this.#piecesDiLUT[to] = this.#piecesDiLUT[from];
            this.#piecesDiLUT[from] = null;
        }
    }

    take(from) {
        if (this.#piecesDiLUT[from] === null) {
            throw new Error("Trying to take the empty field");
        }
        
        this.#piecesDiLUT[from].dataset.type = "taken";
        this.#piecesDiLUT[from] = null;
    }

    promote(di) {
        this.#piecesDiLUT[di].dataset.type = "king";
    }

    resetAll() {
        let di;
        this.#piecesDiLUT.fill(null);
        for (let i = 0; i < piecesCount; i++) {
            di = i;
            this.pieces[1][i].dataset.type = "piece";
            this.#piecesDiLUT[di] = this.pieces[1][i];
            this.move(di, di);

            di = i + dataCount - piecesCount;
            this.pieces[0][i].dataset.type = "piece";
            this.#piecesDiLUT[di] = this.pieces[0][i];
            this.move(di, di);
        }
    }
}