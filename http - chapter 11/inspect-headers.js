var util = require('util');

require('http').createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end(util.inspect(req.headers));
}).listen(4000);