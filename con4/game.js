const websocket = require("ws");

const game = function(gameID) {
    this.redPlayer = null;
    this.yellowPlayer = null;
    this.turn = "red";
    this.ID = gameID;
    this.state = "0 players joined";

    this.transitionStates = {
        "0 players joined": 0,
        "1 players joined": 1,
        "2 players joined": 2,
        "piece added": 3,
        "red player won": 4,
        "yellow player won": 5,
        "aborted": 6,
        "tie": 7
    };

    this.transitionMatrix = [
        [0, 1, 0, 0, 0, 0, 0, 0], //0 players waiting
        [1, 0, 1, 0, 0, 0, 0, 0], //1 player waiting
        [0, 0, 0, 1, 0, 0, 1, 0], //2 players joined (When two players join the game automatically starts)
        [0, 0, 0, 1, 1, 1, 1, 1], //a piece was added
        [0, 0, 0, 0, 0, 0, 0, 0], //red player won
        [0, 0, 0, 0, 0, 0, 0, 0], //yellow player won
        [0, 0, 0, 0, 0, 0, 0, 0], //game aborted
        [0, 0, 0, 0, 0, 0, 0, 0] //Tie
    ];

    this.isValidTransition = function(from, to) {
        let i,j;

        if (!(from in this.transitionStates)) {
            return false;
        } else {
            i = this.transitionStates[from];
        }

        if (!(to in this.transitionStates)) {
            return false;
        } else {
            j = this.transitionStates[to];
        }

        return this.transitionMatrix[i][j] === 1;
    };

    this.isValidState = function(s) {
        return s in this.transitionStates;
    };

    this.setStatus = function(w) {
        if (this.isValidState(w) &&
        this.isValidTransition(this.state, w)) {
            this.state = w;
            console.log("[STATUS] %s", this.state);
        } else {
            return new Error(
                `Impossible status change from ${this.state} to ${w}`
            );
        }
    };

    this.hasTwoPlayers = function() {
        return this.state === "2 players joined";
    };

    this.addPlayer = function(p) {
        if (this.state !== "0 players joined" && this.state !== "1 players joined") {
            return new Error(
              `Invalid call to addPlayer, current state is ${this.state}`
            );
        }

        const error = this.setStatus("1 players joined");
        if (error instanceof Error) {
            this.setStatus("2 players joined");
        }

        if (this.redPlayer == null) {
            this.redPlayer = p;
            return "RED";
        } else {
            this.yellowPlayer = p;
            return "YELLOW";
        }

    };

};

module.exports = game;