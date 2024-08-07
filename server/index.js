const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

let user = {};

io.on("connection", (socket) => {
  console.log(socket);
  socket.on("new-user", (user) => {
    socket.broadcast.emit("user-connected", user);
  });

  socket.on("send-chat-msg", (msg) => {
    socket.broadcast.emit("chat-msg");
  });
});
