var connect = require('connect'),
    qs = require('qs'),
    url = require('url'),
    format = require('util').format,
    session = require('express-session');

var app = connect();



app.use(session({
    cookie: {maxAge: 24 * 60 * 60 * 100},
    secret: 'test'
}));

// custom middleware to to add the query to the request since
// the actual query middleware is no long supported
app.use(function(req, res, next) {
    req.query = qs.parse(url.parse(req.url).query);
    next();
});

app.use(function (req, res) {
    for(var name in req.query) {
        req.session[name] = req.query[name];
    }

    res.end(format(req.session) + '\n');
});

app.listen(8080);