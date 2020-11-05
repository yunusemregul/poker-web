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
