var connect = require('connect'),
    static = require('serve-static'),
    app = connect();

// server will look in this folder first
app.use(static(__dirname + '/public'));

// response if the asked for file is not in ./public
app.use(function (req, res) {
    res.end('Hello!!');
});

app.listen(8080);
