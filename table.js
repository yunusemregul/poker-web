var pot = 0;
exports.pot = pot;

const serv = require("./server.js");

function addPotMoney(amount){
	pot += amount;

	serv.io.sockets.emit("update_pot", pot);
	exports.pot = pot;
}

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

function nextTurnToBet(){
	var players = serv.connectedPlayers;
	var len = players.length;

	var index = players.indexOf(currentPlayerToBet);

	if (players[index + 1] == undefined){
		var newPlayer = players[0];
		currentPlayerToBet = players[0];
		serv.io.to(newPlayer.id).emit("your_turn to bet");
	}
	else{
		console.log(players[index+1]);
		currentPlayerToBet = players[index+1];		
	}
}
exports.nextTurnToBet = nextTurnToBet;