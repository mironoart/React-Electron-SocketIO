var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http)

io.on('connection', function (socket) {
    console.log('Server: connected')
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    socket.on('chat message', function (msg) {
        io.emit('message', msg)
    })
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})

http.listen(3000, function () {
    console.log('listening on *:3000');
});
