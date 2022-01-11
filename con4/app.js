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
const wss = new websocket.Server({ server })

const websockets = {};

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0;

wss.on("connection", function connection(ws) {

    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websockets[con["id"]] = currentGame;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.ID} as ${playerType}`
    );

    con.send(playerType === "RED" ? messages.S_PLAYER_RED : messages.S_PLAYER_YELLOW);

    if (currentGame.hasTwoPlayers()) {
        const msg = messages.O_TWO_PLAYER;
        currentGame.redPlayer.send(JSON.stringify(msg));
        currentGame.yellowPlayer.send(JSON.stringify(msg));
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    con.on("message", function incoming(message) {
        const oMsg = JSON.parse(message.toString());

        const gameObj = websockets[con["id"]];

        if (oMsg.type === messages.T_ADD_PIECE) {
            const newMsg = messages.O_ADD_PIECE;
            newMsg.data = oMsg.data;
            console.log("Server msg data: " + oMsg.data);
            if (gameObj.redPlayer === con) {
                gameObj.yellowPlayer.send(JSON.stringify(newMsg));
            } else {
                gameObj.redPlayer.send(JSON.stringify(newMsg));
            }
            gameObj.setStatus("piece added");
        }
        if (oMsg.type === messages.T_GAME_END) {
            const msg = oMsg;
            msg.type = messages.T_GAME_OVER;
            msg.data = oMsg.data;
            gameObj.redPlayer.send(JSON.stringify(msg));
            gameObj.yellowPlayer.send(JSON.stringify(msg));
            gameStatus.gamesPlayed++;
        }
    });

    con.on("close", function (code) {
        console.log(`${con["id"]} disconnected ...`);

        if (code === 1001) {
            const gameObj = websockets[con["id"]];

            if (gameObj.isValidTransition(gameObj.state, "aborted")) {
                gameObj.setStatus("aborted");
                gameStatus.gamesPlayed++;
            }

            try {
                let msg = messages.O_GAME_ABORTED;
                gameObj.redPlayer.send(JSON.stringify(msg));
                gameObj.redPlayer.close();
                gameObj.redPlayer = null;
            } catch (e) {
                console.log("Player Red closing: " + e);
            }

            try {
                let msg = messages.O_GAME_ABORTED;
                gameObj.yellowPlayer.send(JSON.stringify(msg));
                gameObj.yellowPlayer.close();
                gameObj.yellowPlayer = null;
            } catch (e) {
                console.log("Player Yellow closing: " + e);
            }
        }
    })
});

server.listen(port);