var fs = require('fs');

require('http').createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'video/mp4'});
    var rs = fs.createReadStream('movie.mp4');
    rs.pipe(res);
}).listen(4000);