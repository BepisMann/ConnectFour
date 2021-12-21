function piece(color) {
    this.color = color;
}

function gameState() {
    this.turn = "red";

    this.board = new Array(6);
    for (let i = 0; i < 6; i++){
        board[i] = new Array(7);
    }    

    function addPiece(column) {
        let i = 0;
        while (board[i][column] != undefined)
            i++;
        board[i][column] = this.turn;
        if (checkWin()) {

        }
        else {
            this.turn = "yellow"?"red":"yellow";
            if (i == 6) {
                setColumnInvalid(column);
            }
        }
    }
}