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
	if (player.removeChips(amount)){
		addPotMoney(amount);
	} else {
		return 0;
	}
}
exports.takeBet = takeBet;

var currentPlayerToBet;
exports.currentPlayerToBet = currentPlayerToBet;

function resetTurnsToBet(){
	var players = serv.connectedPlayers;
	currentPlayerToBet = players[0]
}

exports.resetTurnsToBet = resetTurnsToBet;

function checkPlayerTurnToBet(player){
	if (player == currentPlayerToBet){
		return true;
	} else {
		return false;
	}
}
exports.checkPlayerTurnToBet = checkPlayerTurnToBet;

function skipFoldedPlayers(){
	var players = serv.connectedPlayers;
	var len = players.length;

	var index = players.indexOf(currentPlayerToBet);

	var count = 0;

	var realindex = 0;

	for (i = index; i < len;i ++){

		if (currentPlayerToBet[i + 1] == undefined){
			realindex = i - len - 1;

			if (players[realindex].folded){
				count++
			} else {
				return;
			}
		} else {
			if (players[index].folded){
				count++
			} else 
			{
				return;
			}
		}
	}

	return count;
}

function nextTurnToBet(){
	var players = serv.connectedPlayers;
	var len = players.length;

	var index = players.indexOf(currentPlayerToBet);

	if (players[index + 1] == undefined){
		currentPlayerToBet = players[0];
	} else {
		currentPlayerToBet = players[index + 1];
	}
	console.log(currentPlayerToBet.name);
}
exports.nextTurnToBet = nextTurnToBet;