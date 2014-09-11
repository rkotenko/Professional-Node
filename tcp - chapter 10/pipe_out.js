var ws = require('fs').createWriteStream('my.txt');
require('net').createServer(function (socket) {
    socket.pipe(ws);
}).listen(4001);