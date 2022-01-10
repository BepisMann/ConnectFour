const express = require("express");
const http = require("http");
const websocket = require("ws");
var messages = require("./public/javascripts/messages");
const indexRouter = require("./routes/index");

const gameStatus = require("./statTracker");
const Game = require("./game");


const port = process.argv[2];
const app = express();

app.get("/play", indexRouter);
app.get("/", indexRouter);
app.get("/rules", indexRouter);

app.use(express.static(__dirname + "/public"));
//http.createServer(app).listen(port);

const server = http.createServer(app);
const wss = new websocket.Server({server})

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0;

wss.on("connection", function connection(ws) {

    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websocket[con["id"]] = currentGame;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.ID} as ${playerType}`
    );

    con.send(playerType === "RED" ? messages.S_PLAYER_RED : messages.S_PLAYER_YELLOW);

    if (currentGame.hasTwoPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    con.on("message", function incoming(message) {
        const oMsg = JSON.parse(message.toString());

        const gameObj = websocket[con["id"]];

        if (oMsg.type === messages.T_ADD_PIECE) {
            if (gameObj.redPlayer === con) {
                gameObj.yellowPlayer.send(message);
            } else {
                gameObj.redPlayer.send(message);
            }
            gameObj.setStatus("piece added");
        }
        if (oMsg.type === messages.T_GAME_END) {
            const msg = JSON.parse(message);
            msg.type = messages.T_GAME_OVER;
            gameObj.redPlayer.send(msg);
            gameObj.yellowPlayer.send(msg);
            gameStatus.gamesPlayed++;
        }
    });

    con.on("close", function (code) {
        console.log(`${con["id"]} disconnected ...`);

        if (code === 1001) {
            const gameObj = websocket[con["id"]];

            if (gameObj.isValidTransition(gameObj.state, "aborted")) {
                gameObj.setStatus("aborted");
                gameStatus.gamesPlayed++;
            }

            try {
                gameObj.redPlayer.close();
                gameObj.redPlayer = null;
            } catch (e) {
                console.log("Player Red closing: " + e);
            }

            try {
                gameObj.yellowPlayer.close();
                gameObj.yellowPlayer = null;
            } catch (e) {
                console.log("Player Yellow closing: " + e);
            }
        }
    })
});

server.listen(port);