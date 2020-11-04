var serv = io();

serv.on("test", (data) => {
  serv.emit("sendback", "test");
});

serv.on("error", (err) => {
  console.log(err);
});
