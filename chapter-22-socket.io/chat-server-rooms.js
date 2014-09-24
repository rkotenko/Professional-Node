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

// When a client joins, add them immediately to the main room.  If this is not done, a broadcast
// from a client not in a room goes to everyone in every room
io.use(function(socket, next){
    socket.join('Main');
    socket.room = 'Main';
    next();
});

io.on('connection', function (socket) {
    socket.on('clientMessage', function (content) {
        // broadcast sends it to all OTHER sockets, so send it also to the socket that originally
        // sent the message
        socket.emit('serverMessage', 'You said: ' + content);
        
        if(!socket.username) {
            socket.username = socket.id;
        }    
        
        // if the client has a room attribute, broadcast to that room
        if(socket.room) {
            socket.broadcast.to(socket.room);
        }
        
        socket.broadcast.emit('serverMessage', socket.username + ' said: ' + content);
    });

    socket.on('login', function (username) {
        socket.username = username;
        socket.emit('serverMessage', 'Current logged in as ' + username);
        socket.emit('serverMessage', 'You are current in the ' + socket.room + ' room.');
        socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
    });
    
    socket.on('disconnect', function () {
        socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' disconnected');
    });
    
    // if the join event is received, join the socket to the room
    socket.on('join', function (room) {
        var oldRoom = socket.room;
        socket.room = room;
        socket.join(room);
        
        if(oldRoom) {
            socket.leave(oldRoom);
        }
        
        var username = socket.username;
        if(!username) {
            username = socket.id;
        }
        
        socket.emit('serverMessage', 'You joined room ' + room);
        socket.broadcast.to(room).emit('serverMessage', 'User ' + username + ' joined this room');
    });
    
    socket.emit('login');
});