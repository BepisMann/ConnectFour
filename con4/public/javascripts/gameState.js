function piece(color) {
    this.color = color;
}

function GameState() {
    this.turn = "red";
    this.filledCells = [];

    this.board = new Array(6);
    for (let i = 0; i < 6; i++){
        this.board[i] = new Array(7);
    }    

    this.addPiece = function addPiece(column) {
        let i = 0;
        while (this.board[i][column] !== undefined) {
            i++;
        }
        this.board[i][column] = this.turn;
        const cell = document.getElementById(i + ":" + column);
        cell.innerText = this.turn;
        cell.className = this.turn;
        if (this.checkWin(i, column)) {
            console.log("IT WORKSSS!!!")
        }
        else {
            if (this.turn === "red") {
                this.turn = "yellow";
            } else {
                this.turn = "red";
            }

            if (i === 6) {
                //setColumnInvalid(column);
            }
        }
    };

    this.checkWin = function checkWin(row, column) {
        return this.checkHorizontal(row) || this.checkVertical(column) || this.checkDiagonalLR(row, column) || this.checkDiagonalRL(row, column);
    };

    this.checkHorizontal = function checkHorizontal(row) {
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
    };

    this.checkVertical = function checkVertical(column) {
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
    };

    this.checkDiagonalLR = function checkDiagonalLR(row, column) {
        let r = row;
        let c = column;
        const min = (row < (column)) ? row : (column);
        r -= min;
        c -= min;

        let result = 0;

        while (r < 6 && c < 7) {
            if (this.board[r][c] === this.turn) {
                result++;
            } else {
                result = 0;
            }
            if (result === 4) {
                return true;
            }
            r++;
            c++;
        }
        return false;
    };

    this.checkDiagonalRL = function checkDiagonalRL(row, column) {
        let r = row;
        let c = column;
        const min = (row < (6-column)) ? row : (6-column);
        r -= min;
        c += min;

        let result = 0;

        while (r < 6 && c >= 0) {
            if (this.board[r][c] === this.turn) {
                result++;
            } else {
                result = 0;
            }
            if (result === 4) {
                return true;
            }
            r++;
            c--;
        }
        return false;
    };

    // function contains(cell) {
    //     for (let i = 0; i < this.filledCells.length; i++) {
    //         if (this.filledCells[i] === cell) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
}