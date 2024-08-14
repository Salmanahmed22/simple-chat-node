const express = require("express");
const http = require("http");
const { emit } = require("process");
//web socket
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  //TODO: implement server-side event handlers
  socket.on("join", (username) => {
    console.log(`User ${username} joined`);
    socket.username = username;
    socket.broadcast.emit("newUser", username);
  });
  socket.on("chatMessage", (message) => {
    io.emit("message",message, socket.username);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("newtyping", socket.username);
  });
  socket.on("disconnect", () => {
    if(socket.username) {
      console.log(`${socket.username} has left the chat`);  
      io.emit("userLeft", socket.username);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
