var connect = require('connect'),
    morgan = require('morgan');

var app = connect();

// setup logger middleware
app.use(morgan('tiny'));

// response to send to requester
app.use(function (req, res) {
    res.end('Hello World!');
});

app.listen(8080);