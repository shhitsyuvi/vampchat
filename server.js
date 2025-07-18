const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let messages = [];

io.on('connection', (socket) => {
    let username = null;

    socket.emit('chat history', messages);

    socket.on('set name', (name, callback) => {
        username = name;
        callback(true);
        const joinMsg = { name, text: `${name} joined`, time: Date.now(), system: true };
        messages.push(joinMsg);
        io.emit('chat message', joinMsg);
    });

    socket.on('chat message', (text) => {
        if (!username) return;
        const msg = { name: username, text, time: Date.now(), system: false };
        messages.push(msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        if (username) {
            const leaveMsg = { name: username, text: `${username} left`, time: Date.now(), system: true };
            messages.push(leaveMsg);
            io.emit('chat message', leaveMsg);
        }
    });
});

server.listen(3000);
