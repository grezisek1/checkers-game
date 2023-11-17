const piecesImages = [
    "./assets/piece-white.svg",
    "./assets/piece-red.svg",
    "./assets/piece-white-king.svg",
    "./assets/piece-red-king.svg",
];

export default class UI {
    setTurn(playerIndex) {
        turn.src = piecesImages[playerIndex];
    }
    setScore(score) {
        white_score.textContent = score[0].toString();
        red_score.textContent = score[1].toString();
    }
    setWinner(playerIndex) {
        winner_img.src = piecesImages[playerIndex];
    }
    showWinner() {
        winner.showModal();
    }
    hideWinner() {
        winner.close();
    }
}