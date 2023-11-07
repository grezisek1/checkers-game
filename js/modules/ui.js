const piecesImages = [
    "./assets/piece-white.svg",
    "./assets/piece-red.svg",
    "./assets/piece-white-king.svg",
    "./assets/piece-red-king.svg",
];

export class UI {
    setTurn(playerNumber) {
        turn.src = piecesImages[playerNumber];
    }
    setScore(score) {
        white_score.textContent = score[0].toString();
        red_score.textContent = score[1].toString();
    }
}