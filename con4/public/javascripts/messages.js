(function (exports) {
   /*
    * Client to server: Game is complete.
    */
    exports.T_GAME_END = "GAME-ENDED-BY";
    exports.O_GAME_END = {
        type: exports.T_GAME_END,
        data: null,
    };

   /*
    * Server to client: Game is aborted, other player disconnected.
    */
    exports.O_GAME_ABORTED = {
        type: "GAME-ABORTED",
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

   /*
    * Server to client: Set as red player.
    */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_RED = {
        type: exports.T_PLAYER_TYPE,
        data: "RED",
    };
    exports.S_PLAYER_RED = JSON.stringify(exports.O_PLAYER_RED);

   /*
    * Server to client: Set as yellow player.
    */
    exports.O_PLAYER_YELLOW = {
        type: exports.T_PLAYER_TYPE,
        data: "YELLOW",
    };
    exports.S_PLAYER_YELLOW = JSON.stringify(exports.O_PLAYER_YELLOW);

   /*
    * Client to server: Added piece.
    */
    exports.T_ADD_PIECE = "ADD-A-PIECE";
    exports.O_ADD_PIECE = {
        type: exports.T_ADD_PIECE,
        data: null,
    };

   /*
    * Server to client: Game over with results.
    */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null,
    };

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server