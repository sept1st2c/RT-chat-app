const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  // console.log(socket);
  socket.on("new-user", (user) => {
    users[socket.id] = user;
    // console.log(users);
    socket.broadcast.emit("user-connected", user);
  });

  socket.on("send-chat-message", (msg) => {
    console.log(`${users[socket.id]}: ${msg}`);
    socket.broadcast.emit("chat-message", { user: users[socket.id], msg });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);

    delete users[socket.id];
  });
});
