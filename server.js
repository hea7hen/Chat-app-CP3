const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (username) => {
    activeUsers.add(username);
    io.emit('userList', Array.from(activeUsers));
  });

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    const username = Array.from(activeUsers).find(user => user === socket.username);
    if (username) {
      activeUsers.delete(username);
      io.emit('userList', Array.from(activeUsers));
    }
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
