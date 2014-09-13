var tls = require('tls'),
    fs = require('fs'),
    port = 4001,
    clients = [],
    options = {
        key: fs.readFileSync('./server_key.pem'),
        cert: fs.readFileSync('./server_cert.pem'),
        ca: [ fs.readFileSync('server_cert.pem') ]
    };

// distributes the message to other clients
function distribute(from, data) {
    var socket = from.socket;
    clients.forEach(function (client) {
        if(client !== from) {
            client.write(socket.remoteAddress + ':' + socket.remotePort + ' said:' + data);
        }
    });
}

var server = tls.createServer(options, function (client) {
    clients.push(client);

    client.on('data', function (data) {
        distribute(client, data);
    });

    client.on('close', function () {
        console.log('closed connection');
        clients.splice(clients.indexOf(client), 1);
    });
});

server.listen(port, function () {
    console.log('listening on port', server.address().port);
});