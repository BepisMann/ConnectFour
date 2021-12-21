function createBoard() {
    const table = document.querySelector("section#board > table");
    table.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {

            const cell = document.createElement("td");
            cell.id = i + ":" + j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}