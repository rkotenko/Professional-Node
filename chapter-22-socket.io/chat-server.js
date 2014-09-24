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
    socket.on('my event', function (content) {
        console.log(content);
    });
});


