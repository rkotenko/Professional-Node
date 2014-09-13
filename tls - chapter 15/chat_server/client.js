var tls = require('tls'),
    fs = require('fs'),
    port = 4001,
    host = 'localhost',
    options = {
        key: fs.readFileSync('client_key.pem'),
        cert: fs.readFileSync('client_cert.pem'),
        ca: [ fs.readFileSync('server_cert.pem') ]
    };

process.stdin.resume();

var client = tls.connect(port, host, options, function () {
    console.log('connected');
    process.stdin.pipe(client, {end: false}); // send all lines to server
    client.pipe(process.stdout); // print out all data from server
});