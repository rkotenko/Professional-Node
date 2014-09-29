// the ever-trusty hello world example in http server form
require('http').createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.write('Hello world!');
    res.end();
}).listen(4000);

