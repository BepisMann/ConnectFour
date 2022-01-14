var express = require('express');
var router = express.Router();

const gameStats = require("../statTracker");

router.get("/", function(req, res) {
  res.render("splash.ejs", {
    gamesPlayed: gameStats.gamesPlayed,
    playersOnline: gameStats.playersOnline,
    averagePieces: gameStats.averagePieces
  });
});

router.get("/play", function(req, res) {
  res.sendFile("gameScreen.html", { root: "./public" });
});

router.get("/rules", function(req, res) {
  res.sendFile("rules.html", { root: "./public" });
});

module.exports = router;
