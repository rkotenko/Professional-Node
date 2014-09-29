var fs = require('fs'),
    https = require('https'),
    options = {
        key: fs.readFileSync('server_key.pem'),
        cert: fs.readFileSync('server_cert.pem'),
        ca: [ fs.readFileSync('server_cert.pem') ]
    }

var server = https.createServer(options, function (req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end('Hello World');
    console.log('authorized', req.socket.authorized);
}).listen(4001);