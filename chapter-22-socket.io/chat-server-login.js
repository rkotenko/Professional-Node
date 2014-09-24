var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');
http.listen(4000);

// serves up index.html no matter what comes after :4000
function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}
io.on('connection', function (socket) {
    socket.on('clientMessage', function (content) {
        // broadcast sends it to all OTHER sockets, so send it also to the socket that originally
        // sent the message
        socket.emit('serverMessage', 'You said: ' + content);
        socket.broadcast.emit('serverMessage', socket.username + ' said: ' + content);
    });

    socket.on('login', function (username) {
        socket.username = username;
        socket.emit('serverMessage', 'Current logged in as ' + username);
        socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
    });
    
    socket.on('disconnect', function () {
        socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' disconnected');
    });

    socket.emit('login');
});