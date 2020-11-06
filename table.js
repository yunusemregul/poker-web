var pot = 0;
exports.pot = pot;
/*
table.phases
0 - Start of the game betting
1 - Flop
2 - Turn
3 - River*/

var phase = 0;
exports.phase = phase;

const serv = require("./server.js");
const cards = require("./cards.js");

function addPotMoney(amount) {
  pot += amount;

  serv.io.sockets.emit("update_pot", pot);
  exports.pot = pot;
}

function nextPhase() {
  phase++;
  switch (phase) {
    case 1:
      cards.drawFlop();
      cards.sendFlop();
      break;
    case 2:
      cards.drawTurn();
      cards.sendTurn();
      break;
    case 3:
      cards.drawRiver();
      cards.sendRiver();
      break;
    case 4:
      endRound();
  }
  setCurrentPlayerToBet(dealer);
  currentBet = 0;
}
exports.nextPhase = nextPhase;

function takeBet(player, amount) {
  if (player.chips >= amount) {
    player.removeChips(amount);
    serv.chatAddExceptPlayer(player, "#960a00", player.name," bet ", "#960a00", amount, " chips");
    addPotMoney(amount);
  }
}
exports.takeBet = takeBet;

var currentPlayerToBet;
exports.currentPlayerToBet = currentPlayerToBet;

function setCurrentPlayerToBet(player) {
  if (player == undefined){
    currentPlayerToBet = serv.connectedPlayers[0];
  } else {
      if (player.fold){
      currentPlayerToBet = nextPlayerIndex(player);
    } else {
      currentPlayerToBet = player;
    }
  currentPlayerToBet.chatAdd("#ff0000", "Your turn to bet")
}

}
exports.setCurrentPlayerToBet = setCurrentPlayerToBet;

function resetTurnsToBet() {
  var players = serv.connectedPlayers;
  setCurrentPlayerToBet(players[0]);
  exports.currentPlayerToBet = currentPlayerToBet;
}
exports.resetTurnsToBet = resetTurnsToBet;

function checkPlayerTurnToBet(player) {
  var id = player.id;
  if (id == currentPlayerToBet.id) {
    return true;
  } else {
    return false;
  }
}
exports.checkPlayerTurnToBet = checkPlayerTurnToBet;

function playerFold(player) {
  player.fold = true;
  player.chatAdd("You have folded");

  playersInPlay -= 1;
  if (checkWinByFold()){

  } else {
    nextTurnToBet();
    checkNextPhase();  
  }
  console.log(player.name + " folded");
}
exports.playerFold = playerFold;

var playersInPlay = 0;
exports.playersInPlay = playersInPlay;

function setPlayersInPlay(int){
  exports.playersInPlay = int;
}
exports.setPlayersInPlay = setPlayersInPlay;

function resetPlayersInPlay(int){
  playersInPlay = serv.connectedPlayers.length;
  //setCurrentPlayerToBet(nextPlayerIndex(dealer));
}
exports.resetPlayersInPlay = resetPlayersInPlay;

var dealer;
exports.dealer = dealer;

function resetDealer() {
  dealer = serv.connectedPlayers[0];
  exports.dealer = serv.connectedPlayers[0];
}
exports.resetDealer = resetDealer;

function receiveBet(player, amount){
  if (amount > player.chips){
    return 0;
  }
  if (!checkPlayerTurnToBet(player)) {
    player.chatAdd("#ff0000", "Not your turn");
  } else {
    if (currentBet == 0){
      //First bet
      currentBet = amount;
      takeBet(player, amount);
      nextTurnToBet();
      player.updateChips();
      calls = 1;
    } else {
      if ( amount > currentBet){
        //raise
        currentBet = amount;
        player.chatAdd("Raised to " + amount);
        serv.chatAddExceptPlayer(player, player.name + " raised to ", amount + " chips");
        nextTurnToBet();
        calls = 1;
      } else if ( amount < currentBet){
        player.chatAdd("Can't bet less than the currrent bet")
      } else {
        //Normal bet
        calls++;
        takeBet(player, amount);
        player.updateChips();
        if (!checkNextPhase()){
          //Check if we should go to next phase or just go to next player
          nextTurnToBet();
        }      
      }
    }
  }
}
exports.receiveBet = receiveBet;

function endRound(){
  console.log(dealer);
  dealer = nextPlayerIndex(dealer);
  setCurrentPlayerToBet(dealer);
  serv.chatAdd(cards.countScore().name);
}
/*
checkNextPhase()
Return if you should proceed to next round by comparing the number of players in play
with the number of calls there was.
*/

function checkNextPhase(){
  if (playersInPlay == calls){
    nextPhase();
    return true;
  } else {
    return false;
  }
}
/*
checkWinByFold()
Check if there is a winner after a player folds
*/
function checkWinByFold() {
  if ((playersInPlay == 1)) {
    giveVictoryToPlayer(nextPlayerIndex(currentPlayerToBet));
    endRound();
    return true;
  } else {
    return false;
  }
}
/*
giveVictoryToPlayer
Check if there is a winner after a player folds
*/
function giveVictoryToPlayer(player) {
  player.addChips(pot);
  serv.io.to(player.id).emit("player_won", pot);
  serv.io.sockets.emit("reset");
}

function checkWinner(){
  var players = serv.connectedPlayers
  for (i = 0; i < players.length; i++) {
    if (!players[i].fold){
      cards.checkPlayerScore(i);
      var str = players[i].name + " score: " + players[i].score;
      serv.chatAdd(str);  
    }
  }
  return cards.countScore();
}

var currentBet = 0;
exports.currentBet = currentBet;

var calls = 0;
exports.calls = calls;

function nextPlayerIndex(player) {
  var players = serv.connectedPlayers;
  var index = players.indexOf(player);

  if (players[index + 1] == undefined) {
    return players[0];
  } else {
    return players[index + 1];
  }
}

function nextTurnToBet() {
  var players = serv.connectedPlayers;
  var len = players.length;
  setCurrentPlayerToBet(nextPlayerIndex(currentPlayerToBet));

  if (currentPlayerToBet.fold) {
    nextTurnToBet();
  }
}
exports.nextTurnToBet = nextTurnToBet;
