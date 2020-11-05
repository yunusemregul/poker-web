socket.on("chat", (data) => {
  $("#chat").append(data + "<br/>");
});

socket.on("error", (err) => {
  console.log(err);
});

socket.on("sendCards", (id, num, house) => {
  var index = cards.push(new Card(id, num, house));
  updateFace(index == 1 ? face1 : face2, num, house);
  $("#chat").append("Your card: " + cardNames[num] + " of " + houses[house] + "<br/>");
});

socket.on("sendFlop", (id, num, house) => {
  board.push(new Card(id, num, house));
  $("#chat").append("Flop: " + cardNames[num - 1] + " of " + houses[house] + "<br/>");
});

socket.on("update_pot", (num) => {
  pot = num;
  $("#chat").append("Pot is now " + pot + "<br/>");
});

socket.on("update_chips", (amount) => {
  chips = amount;
  $("#chat").append("You have: " + amount + " chips" + "<br/>");
});

socket.on("sendFlop", (id, num, house) => {
  board.push(new Card(id, num, house));
  console.log(board);
  $("#chat").append("Flop: " + cardNames[num] + " of " + houses[house] + "<br/>");
});

socket.on("your_turn", () => {
	$("#chat").append("Your turn" + "<br/>");	
})
function sendBet(amount){
	if (amount <= 0) {
		$("#chat").append("Can't bet lower than 1." + "<br/>");	
	} else {
		socket.emit("send_bet", parseInt(amount));		
	}
