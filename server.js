// just making a little telnet chat server using my memory to make sure it is in there
var net = require('net');

var server = net.createServer();

clients = [];  // array to hold all the users so messages can be broadcast

server.on('connection', function (client) {
    // log the new connection
    console.log('new client has arrived!');
    clients.push(client);


    // broadcast messages from one client to the rest
    client.on('data', function (data) {
        clients.forEach(function (otherClient) {
            if(otherClient !== client) {
                otherClient.write(data);
            }
        });
    });

    // when a client leaves remove them from the client array
    client.on('close', function () {
        console.log('a client has left');
        clients.splice(clients.indexOf(client), 1);
    });
}).listen(4001);