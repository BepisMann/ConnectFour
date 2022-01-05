(function (exports) {
   /*
    * Client to server: Game is complete. The winner is the player sending this message
    */

   /*
    * Server to client: Game is aborted, other player disconnected.
    */

   /*
    * Server to client: Set as red player.
    */

   /*
    * Server to client: Set as yellow player.
    */

   /*
    * Client to server: Added piece.
    */

   /*
    * Server to client: Game over with results.
    */

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server