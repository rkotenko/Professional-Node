var dgram = require('dgram'),
    server = dgram.createSocket('udp4');  // not an actual server, just a peer

server.on('message', function (message, rinfo) {
    console.log('server got message: %s from %s:%d',
                message,
                rinfo.address,
                rinfo.port);
});

var port = 4000;

server.on('listening', function () {
    var address = server.address();
    console.log('server listening on ' + address.address + ';' + address.port)
});

server.on('message', function (message, rinfo) {
    // 0 is the offset
    server.send(message, 0, message.length, rinfo.port, rinfo.address);
});
server.bind(port);