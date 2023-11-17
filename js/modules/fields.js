export const fieldClasses = {
    field: "field",
    selected: "field--selected",
    highlighted: "field--highlighted",
};
const fieldNodeTemplate = document.createElement("button");
fieldNodeTemplate.classList.add(fieldClasses.field);

const fieldsCount = 100;
export default class Fields {
    constructor() {
        this.node = board;
        this.list = new Array(fieldsCount);
        for (let i = 0; i < fieldsCount; i++) {
            this.list[i] = fieldNodeTemplate.cloneNode();
            this.node.appendChild(this.list[i]);
        }
    }

    highlightFields(fields) {
        for (let i = 0; i < 100; i++) {
            this.list[i].classList.toggle(fieldClasses.highlighted, fields.includes(i));
        }
    }
    selectFields(fields) {
        for (let i = 0; i < 100; i++) {
            this.list[i].classList.toggle(fieldClasses.selected, fields.includes(i));
        }
    }
}
