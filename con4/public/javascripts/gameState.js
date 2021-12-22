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

    function checkHorizontal(row) {
        let result = 0;
        const r = this.board[row];
        for (let i = 0; i < 7; i++) {
            if (r[i] === this.turn) {
                result++;
            } else {
                result = 0;
            }
            if (result === 4) {
                return true;
            }
        }
        return false;
    }

    function checkVertical(column) {
        if (column < 3)
            return false;
        let result = 0;
        for (let i = 0; i < 6; i++)
            if (this.board[i][column] === this.turn) {
                result++;
                if (result === 4)
                    return true;
            }
            else {
                result = 0;
            }
        return false;
    }


    // function contains(cell) {
    //     for (let i = 0; i < this.filledCells.length; i++) {
    //         if (this.filledCells[i] === cell) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
}