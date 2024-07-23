const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

const users = {};

app.use(express.static('public'));

// Handle socket.io events here
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-user-joined', (user) => {
    console.log(`${user} joined the chat`);
    users[socket.id] = user;
    socket.broadcast.emit('user-connected', user);
  });

  socket.on('send-message', (message) => {
    console.log(`Message received: ${message.message}`);
    const user = users[socket.id];
    socket.broadcast.emit('receive-message', { user: user, message: message.message });
    console.log(user, ",", message.message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
