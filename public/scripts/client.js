var socket = io();

$(() => {
  $("#chat-entry").keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      socket.emit("chat", $("#chat-entry").val());
      $("#chat-entry").val("");
    }
  });
  $("#press").click(function (){
  	socket.emit("clickedButton");
   });
});

socket.on("chat", (data) => {
  $("#chat").append(data + "<br/>");
});

socket.on("error", (err) => {
  console.log(err);
});

socket.on("sendCards", (id, num, house) => {
	cards.push(new Card(id, num, house));
	console.log(cards);
})

socket.on("sendFlop", (id, num, house) => {
	board.push(new Card(id, num, house));
	console.log(board);
})