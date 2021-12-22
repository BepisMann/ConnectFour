function piece(color) {
    this.color = color;
}

function gameState() {
    this.turn = "red";
    this.filledCells = [];

    this.board = new Array(6);
    for (let i = 0; i < 6; i++){
        this.board[i] = new Array(7);
    }    

    function addPiece(column) {
        let i = 0;
        while (this.board[i][column] !== undefined)
            i++;
        this.board[i][column] = this.turn;
        const cell = document.getElementById(i + ":" + column);
        cell.innerText = this.turn;
        cell.className = this.turn;
        if (checkWin()) {

        }
        else {
            this.turn = "yellow"?"red":"yellow";
            if (i == 6) {
                setColumnInvalid(column);
            }
        }
    }

    function checkWin(row, column) {

    }

    function checkHorizontal

    // function contains(cell) {
    //     for (let i = 0; i < this.filledCells.length; i++) {
    //         if (this.filledCells[i] === cell) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
}