function GameState(socket) {
    this.totalSeconds = 0;
    this.currentTime = 0;
    this.playerType = null;
    this.board = new Array(6);
    this.filledSlots = 0;
    this.socket = socket;
    this.turn = false;

    for (let i = 0; i < 6; i++) {
        this.board[i] = new Array(7);
    }

    this.addPiece = function addPiece(column, color) {
        //Checks if the column has any space left
        if (this.turn === false) {
            return;
        }
        if (this.board[5][column] !== undefined) {
            alert("This column is full! Please choose another column!");
            return;
        }
        let i = 0;
        while (this.board[i][column] !== undefined) {
            i++;
        }
        this.filledSlots++;
        this.board[i][column] = color;
        const cell = document.getElementById(i + ":" + column);
        console.log(cell);
        cell.className = color;

        const turnCell = document.getElementById("yourTurn");
        turnCell.innerText = "Opponents turn";
        this.turn = false;

        this.totalSeconds = Date.now()-this.currentTime;
        const timeCell = document.getElementById("Average time per piece");
        if (this.filledSlots === 0) {
            timeCell.innerText = 0;
        } else {
            timeCell.innerText = ((this.totalSeconds) / ((this.filledSlots) * 1000)).toFixed(2);
        }
    };

    this.checkWin = function checkWin(row, column, color) {
        return this.checkHorizontal(row, color) || this.checkVertical(column, color) || this.checkDiagonalLR(row, column, color) || this.checkDiagonalRL(row, column, color);
    };

    this.checkHorizontal = function checkHorizontal(row, color) {
        let result = 0;
        const r = this.board[row];
        for (let i = 0; i < 7; i++) {
            if (r[i] === color) {
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

    this.checkVertical = function checkVertical(column, color) {
        let result = 0;
        for (let i = 0; i < 6; i++)
            if (this.board[i][column] === color) {
                result++;
                if (result === 4)
                    return true;
            }
            else {
                result = 0;
            }
        return false;
    };

    this.checkDiagonalLR = function checkDiagonalLR(row, column, color) {
        let r = row;
        let c = column;
        const min = (row < (column)) ? row : (column);
        r -= min;
        c -= min;

        let result = 0;

        while (r < 6 && c < 7) {
            if (this.board[r][c] === color) {
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

    this.checkDiagonalRL = function checkDiagonalRL(row, column, color) {
        let r = row;
        let c = column;
        const min = (row < (6-column)) ? row : (6-column);
        r -= min;
        c += min;

        let result = 0;

        while (r < 6 && c >= 0) {
            if (this.board[r][c] === color) {
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

    this.updateGame = function updateGame(column) {
        this.turn = true;
        const color = (this.playerType === "RED") ? "YELLOW" : "RED"
        this.addPiece(column, color);
        this.turn = true;
        let i = 0;
        while (this.board[i][column] !== undefined) {
            if (i === 5)
                break;
            i++;
        }
        if (this.board[i][column] === undefined)
            i--;
        console.log("Check win check 2 i: " + i);
        if (this.checkWin(i, column, color)) {
            console.log("IT WORKSSS!!!");
            this.handleWin((this.playerType === "RED") ? "YELLOW" : "RED");
        }
        else if (this.filledSlots === 42) {
            console.log("TIE");
            this.handleDraw();
        }
    }

    this.handleWin = function handleWin(color) {

        const outMsg = Messages.O_GAME_END;
        outMsg.data = color;
        this.socket.send(JSON.stringify(outMsg));
    }

    this.handleDraw = function handleDraw() {
        const outMsg = Messages.O_GAME_END;
        outMsg.data = "TIE";
        this.socket.send(JSON.stringify(outMsg));
    }

    this.generateBoard = function generateBoard() {
        const section = document.querySelector("section#board");
        const table = document.createElement("table");
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");

            for (let j = 0; j < 7; j++) {

                const cell = document.createElement("td");
                cell.id = (5 - i) + ":" + j;

                row.appendChild(cell);
                cell.addEventListener("click", () => {
                    if (this.turn === true) {
                        this.addPiece(j, this.playerType);
                        const outMsg = Messages.O_ADD_PIECE;
                        outMsg.data = j;
                        this.socket.send(JSON.stringify(outMsg));
                        console.log("MSG data: " + outMsg.data);


                    }
                });
            }
            table.appendChild(row);
        }
        section.appendChild(table);
    }

}

(function setup() {

    const socket = new WebSocket(Setup.WEB_SOCKET_URL);
    const state = new GameState(socket);

    //TODO
    /**
     * Make the board generate after two players connected
     */



    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        if (incomingMsg.type === Messages.T_PLAYER_TYPE) {
            state.playerType = incomingMsg.data;
            const turnCell = document.getElementById("yourTurn");
            const field = document.getElementById("color");
            if (state.playerType === "YELLOW") {
                field.innerText = "Yellow";
                field.className = "Yellow";
                turnCell.innerText = "Opponents turn";
            } else {
                field.innerText = "Red";
                field.className = "Red";
                state.turn = true;
            }
        }

        if (incomingMsg.type === Messages.T_ADD_PIECE) {
            state.updateGame(incomingMsg.data);
            const turnCell = document.getElementById("yourTurn");
            turnCell.innerText = "It's your turn";
        }

        if (incomingMsg.type === Messages.T_TWO_PLAYER) {
            state.generateBoard();
            if (state.playerType === "RED") {
                const turnCell = document.getElementById("yourTurn");
                turnCell.innerText = "Game has started! It's your turn!";
            }
            state.currentTime = Date.now();
        }

        if (incomingMsg.type === Messages.T_GAME_OVER) {
            const turnCell = document.getElementById("yourTurn");
            state.turn = false;
            if (incomingMsg.data === "TIE") {
                turnCell.innerText = "It's a TIE.";
            } else if (incomingMsg.data === state.playerType) {
                turnCell.innerText = "Congrats you won!";
            } else {
                turnCell.innerText = "You lost :("
            }
        }

        if (incomingMsg.type === "GAME-ABORTED") {
            alert("Opponent has disconnected! Please go back to the home screen if you want to play again!");
            const turnCell = document.getElementById("yourTurn");
            turnCell.innerText = "Game Over - Opponent disconnected!";
            state.turn = false;
        }
    }
})();

