require('http').createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end(req.url);
}).listen(4000);