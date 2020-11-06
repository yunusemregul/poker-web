socket.on("chat", (data) => {
  if (typeof data === "object") {
    chatAdd(...data);
  } else {
    chatAdd(data);
  }
});

socket.on("error", (err) => {
  console.log(err);
});

socket.on("cards_send", (id, num, house) => {
  //Sorry I changed the way you create the cards :(
  var index = cards.push(new Card(id, num, house));

  if (index == 2) {
    drawCards();

    for (i = 0; i < 2; i++) {
      updateFace(cardFaces[i], cards[i].id, cards[i].num, cards[i].house);
    }
  }
});

socket.on("flop_send", (id, num, house) => {
  //Receive the flop from server
  var index = board.push(new Card(id, num, house));

  if (index == 3) {
    //When the board array reaches 3 cards we draw the cards
    drawFlop();
    for (i = 0; i < 3; i++) {
      updateFace(boardFaces[i], board[i].id, board[i].num, board[i].house);
    }
  }
});

socket.on("turn_send", (id, num, house) => {
  board.push(new Card(id, num, house));
  drawTurn();
  updateFace(boardFaces[3], board[3].id, board[3].num, board[3].house);
});

socket.on("river_send", (id, num, house) => {
  board.push(new Card(id, num, house));

  drawRiver();
  updateFace(boardFaces[4], board[4].id, board[4].num, board[4].house);
});

socket.on("reset", (num) => {
  //Reset command from server, delete all the card faces, reset arrays
  var children = app.stage.children;

  for (i = 0; i < 5; i++) {
    //Probably a better way to do this than comparing ids to app.stage childrens\
    if (boardFaces[i]) {
      var id = boardFaces[i].id;
      for (j = 0; j < children.length; j++) {
        if (children[j].id == boardFaces[i].id) {
          app.stage.removeChild(children[j]);
        }
      }
    }
  }

  for (i = 0; i < 2; i++) {
    //Also removes cards
    if (cards[i]) {
      var id = cards[i].id;
      for (j = 0; j < children.length; j++) {
        if (children[j].id == cards[i].id) {
          app.stage.removeChild(children[j]);
        }
      }
    }
  }
  flopFaces = [];
  cards = [];
  board = [];
});

socket.on("update_pot", (num) => {
  pot = num;
  chatAdd("Pot is now " + pot);
});

socket.on("update_chips", (amount) => {
  chips = amount;
  chatAdd("You have: " + amount + " chips");
});

socket.on("sendFlop", (id, num, house) => {
  board.push(new Card(id, num, house));
  console.log(board);
  chatAdd("Flop: " + cardNames[num] + " of " + houses[house]);
});

socket.on("your_turn", () => {
  chatAdd("Your turn");
});

socket.on("player_won", (pot) => {
  chatAdd("Your have won " + pot);
});

function sendBet(amount) {
  if (amount <= 0) {
    chatAdd("Can't bet lower than 1.");
  } else {
    socket.emit("send_bet", parseInt(amount));
  }
}
