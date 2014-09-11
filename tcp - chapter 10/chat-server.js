// A simple TCP chat server
var net = require('net');

var server = net.createServer();

var sockets = [];  // array to hold the connections (clients)

// set the server to allow connections
server.on('connection', function (socket) {
    console.log('new connection established');
    sockets.push(socket);

    // listen for data from the connection
    socket.on('data', function (data) {
        console.log('got data:', data);

        sockets.forEach(function (otherSocket) {
            if(otherSocket !== socket) {
                otherSocket.write(data);
            }
        });
    });

    socket.on('close', function () {
        console.log('connection closed');
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);  // remove the socket that closed
    });
});

server.on('error', function (err) {
    console.log('Server error:', err.message);
});

server.on('close', function () {
   console.log('Server closed');
});

server.listen(4001);