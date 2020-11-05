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

const card = require("./cards.js");
const table = require("./table.js");

var connectedPlayers = [];

exports.connectedPlayers = connectedPlayers;

io.on("connection", (socket) => {
  var player = new card.Player(socket.id, "Player ", 1000);
  connectedPlayers.push(player);

  console.log(player.name + " connected");
  socket.emit("chat", "You have connected."); // emit to this player
  socket.broadcast.emit("chat", player.name + " has connected."); // emit to everyone except this player

  socket.on("chat", (data) => {
    var text = data;
    text = text.replace(/<[^>]*>?/gm, ""); // strip html tags

    if (text.length == 0) {
      socket.emit("chat", "Text can't be empty.");
      return;
    }

    var player = connectedPlayers.find((player) => player.id === socket.id);
    io.sockets.emit("chat", player.name + ": " + text); // emit to everyone
  });

  socket.on("disconnect", () => {
    for (i = 0; i < connectedPlayers.length; i++) {
      if (connectedPlayers[i].id === socket.id) {
        connectedPlayers.splice(i, 1);
        console.log(player.name + " disconnected");
        socket.broadcast.emit("chat", player.name + " has disconnected."); // emit to everyone except this player
        break;
      }
    }
  });

  socket.on("send_bet", (amount) => { 
    var player = connectedPlayers.find((player) => player.id === socket.id);
    if (!table.checkPlayerTurn(player)){
      socket.emit("chat", "Not your turn");
    } else {
      table.takeBet(player, amount);
      table.nextTurn();
      player.updateChips();   
    }

  })

  socket.on("round_start", () => {
    card.startRound();
    table.resetTurns();
    player.updateChips();
  })
});

io.on("error", (err) => {
  console.log(err);
});

process.on("uncaughtException", function (err) {
  console.log(err);
});

