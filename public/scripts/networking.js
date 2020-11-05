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

function sendBet(amount) {
  socket.emit("send_bet", parseInt(amount));
}
