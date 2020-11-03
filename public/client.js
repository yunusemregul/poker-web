var socket = io();

socket.on("test", (data) => {
	console.log(data);
	socket.emit("sendback", "test");
})

socket.on( "error", (err) => {
	console.log(err);
})