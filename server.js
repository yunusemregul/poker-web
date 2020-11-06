const port = 3000;

var express = require("express");
var app = express();
var server = app.listen(port);
var io = require("socket.io").listen(server);

exports.io = io;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const cards = require("./cards.js");
const table = require("./table.js");
const {Player} = require("./cards.js");

var connectedPlayers = [];

exports.connectedPlayers = connectedPlayers;

var count = 0;

/* 
  adds some text to everybodys chat
  you can color the text wth giving color first then text
  
  sample usage: 
    chatAdd("#ff0000", player.name + ": ", "#fff", text);
*/
function chatAdd(...args) {
  io.sockets.emit("chat", args);
}
exports.chatAdd = chatAdd;

function chatAddExceptPlayer(player, ...args) {
  player.socket.broadcast.emit("chat", args);
}
exports.chatAddExceptPlayer = chatAddExceptPlayer;

io.on("connection", (socket) => {
  var player = new Player(socket.id, "Player " + " " + count, 1000, socket);
  connectedPlayers.push(player);

  console.log(player.name + " connected");
  player.chatAdd("#1554db", "You", " have connected.");
  player.chatAdd("#ffff00", "Change your name with !name");
  chatAddExceptPlayer(player, "#ff0000", player.name, " has connected."); // emit to everyone except this player
  count++;
  socket.on("chat", (data) => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    var text = data;
    text = text.replace(/<[^>]*>?/gm, ""); // strip html tags

    if (text.length == 0) {
      player.chatAdd("#ff0000", "Text can't be empty.");
      return;
    }

    if (text.startsWith("!name")) {
      var splitted = text.split(" ");

      if (splitted.length != 2) {
        player.chatAdd("#ffff00", "USAGE EXAMPLE: ", "!name charlie");
        return;
      }

      var name = splitted[1];

      if (name.length < 3) {
        player.chatAdd("#ff0000", "Your name must be at least 3 characters length.");
        return;
      }

      player.chatAdd("#1554db", "You", " successfully changed your name from ", "#1554db", player.name, " to ", "#1554db", name, ".");
      player.name = name;

      return;
    }

    player.chatAdd("#1554db", player.name + ": ", text);
    chatAddExceptPlayer(player, "#ff0000", player.name + ": ", text);
  });

  socket.on("disconnect", () => {
    for (i = 0; i < connectedPlayers.length; i++) {
      if (connectedPlayers[i].id === socket.id) {
        connectedPlayers.splice(i, 1);
        console.log(player.name + " disconnected");
        chatAddExceptPlayer(player, "#ff0000", player.name + " has disconnected."); // emit to everyone except this player
        break;
      }
    }
  });

  socket.on("send_bet", (amount) => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    table.receiveBet(player, amount);
  });

  socket.on("flop_send", () => {
    cards.drawFlop();
    cards.sendFlop();
  });

  socket.on("turn_send", () => {
    cards.drawTurn();
    cards.sendTurn();
  });

  socket.on("river_send", () => {
    cards.drawRiver();
    cards.sendRiver();
  });
  socket.on("round_start", () => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    cards.startRound();
    player.updateChips();
  });

  socket.on("reset", () => {
    io.sockets.emit("reset");
  });

  socket.on("hard_reset", () => {
    table.resetDealer();
    console.log(table.dealer.name);
    table.setCurrentPlayerToBet(table.dealer);
    table.resetTurnsToBet();
  });

  socket.on("score", () => {
    for (i = 0; i < connectedPlayers.length; i++) {
      cards.checkPlayerScore(i);
      var str = connectedPlayers[i].name + " score: " + connectedPlayers[i].score;
      chatAdd(str);
    }
    chatAdd(cards.countScore().name);
  });

  socket.on("player_fold", () => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    if (!table.checkPlayerTurnToBet(player)) {
      console.log("Not your turn");
    } else {
      if (player.fold) {
        console.log("Already folded how are you here");
      } else {
        table.playerFold(player);
      }
    }
  });
});

io.on("error", (err) => {
  console.log(err);
});

process.on("uncaughtException", function (err) {
  console.log(err);
});
