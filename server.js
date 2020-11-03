const port = 3000;

var express = require("express");
var app = express();
var server = app.listen(port);
var io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});
