export class Board {
  initBoard() {
    // Loop to create 100 divs for the 10x10 board
    for (let i = 0; i < 100; i++) {
      const square = document.createElement("div");
      board.appendChild(square);
    }
    console.log("Board initialized");
  }
}
