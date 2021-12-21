var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/Game', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get("/", function(req, res) {
  res.sendFile("splash.html", { root: "./public" });
});

router.get("/play", function(req, res) {
  res.sendFile("gameScreen.html", { root: "./public" });
});

router.get("/rules", function(req, res) {
  res.sendFile("rules.html", { root: "./public" });
});

module.exports = router;
