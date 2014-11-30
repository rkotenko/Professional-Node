var restify = require('restify');

function response(req, res, next) {
    res.send('Your request was: ' + req.params.value);
    next();
}

var server = restify.createServer();
server.head();
server.get('api/:value', response);
server.get('/', function(req, res, next) {
    res.send('No API at this location');
    next();
})

server.listen(3000);