const port = 3000;

var express = require("express");
var app = express();
var server = app.listen(port);
var io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const card = require("./cards.js")

var connectedPlayers = [];

var count = 0;

exports.connectedPlayers = connectedPlayers;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("test", "you have connected");

  var player = new card.Player(socket.id, 1000);

  connectedPlayers.push(player);
  if (count == 1)
  {
	card.startRound()

  	console.log(connectedPlayers);  	
  }

  count++;

  socket.on("disconnect", () => {
  	for (i = 0; i < connectedPlayers.length; i++)
  	{
  		if (connectedPlayers.id == socket.id)
  		{
  			connectedPlayers.splice(i, 1);
  			console.log("what the fuck");
  		}
  	}
  		
  })
});

io.on( "error", (err) => {
	console.log(err);
})

process.on('uncaughtException', function(err) {
  console.log(err);
});