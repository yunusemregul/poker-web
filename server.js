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

var count = 0;

io.on("connection", (socket) => {
  var player = new card.Player(socket.id, "Player "+ " " + count, 1000, socket);
  connectedPlayers.push(player);

  console.log(player.name + " connected");
  socket.emit("chat", "You have connected."); // emit to this player
  socket.broadcast.emit("chat", player.name + " has connected."); // emit to everyone except this player
  count++;
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
    if (!table.checkPlayerTurnToBet(player)){
      socket.emit("chat", "Not your turn");
    } else {
      socket.broadcast.emit("chat", player.name + " bet " + amount + " chips");
      table.takeBet(player, amount);
      table.nextTurnToBet();
      player.updateChips();   
    }
  })

  socket.on("flop_send", () => {
    card.drawFlop();
    card.sendFlop();
  })

  socket.on("turn_send", () => {
    card.drawTurn();
    card.sendTurn();
  })

  socket.on("river_send", () => {
    card.drawRiver();
    card.sendRiver();
  })
  socket.on("round_start", () => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    card.startRound();
    table.nextTurnToBet();
    player.updateChips();
  })

  socket.on("reset", () => {
    io.sockets.emit("reset");
    table.resetTurnsToBet();
  })

  socket.on("score", () => {
    for (i = 0;i < connectedPlayers.length; i++){
      card.checkPlayerScore(i);
      var str = connectedPlayers[i].name + " score: " + connectedPlayers[i].score;
      io.sockets.emit("chat", str);
    }
    io.sockets.emit("chat", card.countScore().name);
  })

  socket.on("player_fold", () => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    if (!table.checkPlayerTurnToBet(player)){
      console.log("Not your turn")
    } else {
      if (player.fold){
       console.log("Already folded how are you here")
      } else {
        table.playerFold(player);
      }
    }

  })
});

io.on("error", (err) => {
  console.log(err);
});

process.on("uncaughtException", function (err) {
  console.log(err);
});

