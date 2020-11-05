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
  	sendBet(parseInt($("#chat-entry").val()));
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
	$("#chat").append("Your card: " + cardNames[num] + " of " + houses[house]+"<br/>");
})

socket.on("sendFlop", (id, num, house) => {
	board.push(new Card(id, num, house));
	$("#chat").append("Flop: " + cardNames[num-1] + " of " + houses[house]+"<br/>");
})

socket.on("update_pot", (num) => {
	pot = num;
	console.log("pot is now: "+pot);
})

function sendBet(amount){
	socket.emit("send_bet", amount);
}