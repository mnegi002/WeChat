const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const users = {};

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
        const user = users[socket.id];
        socket.broadcast.emit('user-disconnected', user);
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
