var server = require('net').createServer(function (socket) {
    console.log('new connection');
    socket.write('hello!  This socket will close in 5 seconds');
    socket.setTimeout(5000);
    socket.on('timeout', function () {
        socket.write('And we are done here. GOODBYE!');
        socket.end();
    });

    socket.on('end', function () {
        console.log('Client connection ended');
    });
}).listen(4001);
