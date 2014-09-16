var connect = require('connect'),
    format = require('util').format,
    session = require('express-session');

var app = connect();

app.use(session({
    cookie: {maxAge: 24 * 60 * 60 * 100},
    secret: 'test'
}));

app.use(function (req, res) {
   req.session['rob'] = req.url;
   res.end(format(req.session) + '\n');
});

app.listen(8080);