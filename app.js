const path = require('path');
const express = require('express');
const app = express();

// Socket.io setup with express server
const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');
const io = socketIo(server);

// view engine setup with ejs template engine and public folder for static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`New WebSocket connection: ${socket.id}`); 
    socket.on('sendLocation', (coords) => {
        io.emit('locationMessage', {id: socket.id, ...coords});
    });
    
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`); 
        io.emit('disconnectMessage', {id: socket.id});
    });
});


app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});