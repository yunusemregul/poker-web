socket.on("chat", (data) => {
  $("#chat").append(data + "<br/>");
});

socket.on("error", (err) => {
  console.log(err);
});

socket.on("cards_send", (id, num, house) => { //Sorry I changed the way you create the cards :(
  var index = cards.push(new Card(id, num, house));

  if (index == 2){
    drawCards();

    for (i = 0; i < 2; i++){
      updateFace(cardFaces[i], cards[i].id, cards[i].num, cards[i].house);
    }
  }
});

socket.on("flop_send", (id, num, house) => { //Receive the flop from server
  board.push(new Card(id, num, house));

  var len = board.length
  if (len == 3){ //When the board array reaches 3 cards we draw the cards
    drawFlop();
    for (i = 0; i < 3; i++){
      updateFace(boardFaces[i], board[i].id, board[i].num, board[i].house);
    }
  }
});

socket.on("turn_send", (id, num, house) => {
  board.push(new Card(id, num, house));
  drawTurn();
  updateFace(boardFaces[3], board[3].id, board[3].num, board[3].house);
})

socket.on("river_send", (id, num, house) => {
  board.push(new Card(id, num, house));

  drawRiver();
  updateFace(boardFaces[4], board[4].id, board[4].num, board[4].house);  
})

socket.on("reset", (num) => { //Reset command from server, delete all the card faces, reset arrays
  var children = app.stage.children;

  for (i = 0; i < 5; i++){ //Probably a better way to do this than comparing ids to app.stage childrens
    var id = boardFaces[i].id;
    for (j = 0; j < children.length; j++){
      if (children[j].id == boardFaces[i].id){
        app.stage.removeChild(children[j]);
      }
    }
  }

  for (i = 0; i < 2; i++){
    var id = cards[i].id;
    for (j = 0; j < children.length; j++){
      if (children[j].id == cards[i].id){
        app.stage.removeChild(children[j]);
      }
    }
  }
  flopFaces = [];
  cards = [];
  board = [];
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
}