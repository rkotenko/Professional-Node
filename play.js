var http = require('http');

var server = http.createServer(function (req, res) {
    console.log(req);
    /*res.writeHead(200, {'Content-type': 'text/plain'});
    req.pipe(res);
    res.end();*/
});

server.listen(3000);
