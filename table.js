var pot = 0;
exports.pot = pot;
/*
table.phases
0 - Start of the game betting
1 - Flop
2 - Turn
3 - River*/

var phases = 0;
exports.phases = phases;

const serv = require("./server.js");
const cards = require("./cards.js");

function addPotMoney(amount){
	pot += amount;

	serv.io.sockets.emit("update_pot", pot);
	exports.pot = pot;
}

function nextPhase(){
	switch (phases){
		case 0:
			cards.drawFlop();
			cards.sendFlop();
		break;
		case 1:
			cards.drawTurn();
			cards.sendTurn();
		break;
		case 2:
			cards.drawRiver();
			cards.sendRiver();
		break;
	}

}
exports.nextPhase = nextPhase;

function takeBet(player, amount){
	if (player.chips > amount){
		player.removeChips(amount);
		addPotMoney(amount);
	} else {
		return 0;
	}
}
exports.takeBet = takeBet;

var currentPlayerToBet;
exports.currentPlayerToBet = currentPlayerToBet;

function setCurrentPlayerToBet(player){
	currentPlayerToBet = player;
}
exports.setCurrentPlayerToBet = setCurrentPlayerToBet;

function resetTurnsToBet(){
	var players = serv.connectedPlayers;
	currentPlayerToBet = players[0]
	exports.currentPlayerToBet = currentPlayerToBet;
}
exports.resetTurnsToBet = resetTurnsToBet;

function checkPlayerTurnToBet(player){
	var id = player.id;
	if (id == currentPlayerToBet.id){
		return true;
	} else {
		return false;
	}
}
exports.checkPlayerTurnToBet = checkPlayerTurnToBet;

function playerFold(player){
	player.fold = true;

	checkWinByFold();

	console.log(player.name + " folded");
	nextTurnToBet();
}
exports.playerFold = playerFold;

var playersInPlay = 0;
exports.playersInPlay = playersInPlay;

var dealer;
exports.dealer = dealer;

function resetDealer(){
	dealer = serv.connectedPlayers[0];
}
exports.resetDealer = resetDealer;

function checkWinByFold(){
	if (playersInPlay = 1){
		giveVictoryToPlayer(nextPlayerIndex(currentPlayerToBet));
	}
}

function giveVictoryToPlayer(player){
	player.addChips(pot)
	serv.io.to(player.id).emit("player_won", pot);
	serv.io.sockets.emit("reset");
	pot = 0;
	dealer = nextPlayerIndex(dealer);
}

function nextPlayerIndex(player){
	var players = serv.connectedPlayers;
	var index = players.indexOf(player);

	if (players[index + 1] == undefined){
		return players[0];
	} else {
		return players[index + 1];
	}
}

function nextTurnToBet(){
	var players = serv.connectedPlayers;
	var len = players.length;
	currentPlayerToBet = nextPlayerIndex(currentPlayerToBet);
	
	if (currentPlayerToBet.fold){
		nextTurnToBet();
	} else {
		serv.io.to(currentPlayerToBet.id).emit("your_turn");
	}
}
exports.nextTurnToBet = nextTurnToBet;
