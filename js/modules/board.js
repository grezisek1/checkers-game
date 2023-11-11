export const boardClasses = {
  field: "field",
  selected: "field--selected",
  highlighted: "field--highlighted",
};

export class Board {
  initBoard() {
    this.fields = new Array(100);
    
    const fieldNode = document.createElement("button");
    fieldNode.classList.add(boardClasses.field);

    // Loop to create 100 fields for the 10x10 board
    for (let i = 0; i < 100; i++) {
      this.fields[i] = fieldNode.cloneNode();
      board.appendChild(this.fields[i]);
    }
  }
  
  highlightFields(fields) {
    for (let i = 0; i < 100; i++) {
      this.fields[i].classList.toggle(boardClasses.highlighted, fields.includes(i));
    }
  }
  selectFields(fields) {
    for (let i = 0; i < 100; i++) {
      this.fields[i].classList.toggle(boardClasses.selected, fields.includes(i));
    }
  }
}
