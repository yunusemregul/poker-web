var socket = io();

$(() => {
  $("#chat-entry").keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
    	socket.emit("test2");
      socket.emit("chat", $("#chat-entry").val());
      $("#chat-entry").val("");
    }
  });
  $("#bet").click(function (){
  	sendBet($("#chat-entry").val());
   });
   $("#start").click(function (){
  	socket.emit("round_start");
   });
   $("#flop").click(function (){
  	socket.emit("flop_send");
   });
   $("#turn").click(function (){
  	socket.emit("turn_send");
   });
   $("#river").click(function (){
  	socket.emit("river_send");
   });
   $("#reset").click(function (){
  	socket.emit("reset");
   });
   $("#fold").click(function (){
  	socket.emit("player_fold");
   });
   $("#score").click(function (){
  	socket.emit("score");
   });
});