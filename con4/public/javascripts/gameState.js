//const Setup = require("config");



//import {O_ADD_PIECE, T_PLAYER_TYPE, O_GAME_END} from "./messages";

function GameState(socket) {
    this.playerType = null;
    this.board = new Array(6);
    this.filledSlots = 0;
    this.socket = socket;

    for (let i = 0; i < 6; i++) {
        this.board[i] = new Array(7);
    }

    this.addPiece = function addPiece(column, color) {
        //Checks if the column has any space left
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
        //cell.innerText = color;
        cell.className = color;

        // else {
        //     if (this.turn === "red") {
        //         this.turn = "yellow";
        //     } else {
        //         this.turn = "red";
        //     }
        // }
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
        if (column < 3)
            return false;
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
        const color = (this.playerType === "RED") ? "YELLOW" : "RED"
        this.addPiece(column, color);

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

}

//const state = new GameState();

(function setup() {
    const table = document.querySelector("section#board > table");
    const socket = new WebSocket("ws://localhost:3000");
    const state = new GameState(socket);

    //TODO
    /**
     * Make the board generate after two players connected
     */

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {

            const cell = document.createElement("td");
            cell.id = (5 - i) + ":" + j;
            cell.innerText = "color";

            row.appendChild(cell);
            cell.addEventListener("click", () => {
                state.addPiece(j, state.playerType);
                const outMsg = Messages.O_ADD_PIECE;
                outMsg.data = j;
                state.socket.send(outMsg);
            });
        }
        table.appendChild(row);
    }

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        if (incomingMsg.type === Messages.T_PLAYER_TYPE) {
            state.playerType = incomingMsg.data;

            const field = document.getElementById("color");
            if (state.playerType === "YELLOW") {
                field.innerText = "Yellow";
                field.className = "Yellow";
            } else {
                field.innerText = "Red";
                field.className = "Red"
            }
        }

        if (incomingMsg.type === "ADD-A-PIECE") {
            const color = (state.playerType === "RED") ? "YELLOW" : "RED";
            state.updateGame(incomingMsg.data);
        }
    }
})();

