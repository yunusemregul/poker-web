var socket = io();

$(() => {
  $("#chat-entry").keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
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
});

