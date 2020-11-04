var socket = io();

$(() => {
  $("#chat-entry").keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      socket.emit("chat", $("#chat-entry").val());
      $("#chat-entry").val("");
    }
  });
});

socket.on("chat", (data) => {
  $("#chat").append(data + "<br/>");
});

socket.on("error", (err) => {
  console.log(err);
});
