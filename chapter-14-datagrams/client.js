var dgram = require('dgram'),
    client = dgram.createSocket('udp4');

var message = new Buffer('hello there from over here');
client.send(message, 0, message.length, 4000, 'localhost', function (err, bytes) {
    if(err) {throw err;}
    client.close();
});

