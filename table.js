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

var currentPlayer;
exports.currentPlayer = currentPlayer;

function resetTurns(){
	var players = serv.connectedPlayers;
	currentPlayer = players[0]
}

exports.resetTurns = resetTurns;

function checkPlayerTurn(player){
	if (player == currentPlayer){
		return true;
	} else {
		return false;
	}
}
exports.checkPlayerTurn = checkPlayerTurn;

function nextTurn(){
	var players = serv.connectedPlayers;
	var len = players.length;

	var index = players.indexOf(currentPlayer);

	if (players[index + 1] == undefined){
		var newPlayer = players[0];
		currentPlayer = players[0];
		serv.io.to(newPlayer.id).emit("your_turn to bet");
	}
	else{
		console.log(players[index+1]);
		currentPlayer = players[index+1];		
	}
}
exports.nextTurn = nextTurn;