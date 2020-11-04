const port = 3000;

var express = require("express");
var app = express();
var server = app.listen(port);
var io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const card = require("./cards.js");

var connectedPlayers = [];

var count = 0;

exports.connectedPlayers = connectedPlayers;

io.on("connection", (socket) => {
  var player = new card.Player(socket.id, "Player" + count, 1000);
  connectedPlayers.push(player);
  count++;

  console.log(player.name + " connected");
  socket.emit("chat", "You have connected.");
  socket.broadcast.emit("chat", player.name + " has connected.");

  if (count == 1) {
    card.startRound();

    console.log(connectedPlayers);
  }

  socket.on("chat", (data) => {
    var player = connectedPlayers.find((player) => player.id === socket.id);
    io.sockets.emit("chat", player.name + ": " + data);
  });

  socket.on("disconnect", () => {
    for (i = 0; i < connectedPlayers.length; i++) {
      if (connectedPlayers[i].id === socket.id) {
        connectedPlayers.splice(i, 1);
        console.log(player.name + " disconnected");
        socket.broadcast.emit("chat", player.name + " has disconnected.");
        break;
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
