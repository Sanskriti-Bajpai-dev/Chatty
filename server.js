const http = require('http'); 
const express = require('express'); 
const cors = require('cors');
const socketIO = require('socket.io');


const app = express(); 
const httpServer = http.createServer(app); 

const io = socketIO(httpServer, {
    cors: {
        origin: "*", // Allow all origins for testing; consider restricting this in a production environment
        methods: ["GET", "POST"],
    }
});

const users = {}

io.on('connection', socket => {
    socket.on('new-user', name=>{
        users[socket.io] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message =>{
        socket.broadcast.emit('chat-message',{message: message, name: users[socket.id]})
        
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
      })
});





httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});


