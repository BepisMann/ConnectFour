var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/Game', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get("/", function(req, res) {
  res.sendFile("splash.html", { root: "./public" });
});

module.exports = router;
