var connect = require('connect'),
    qs = require('qs'),
    url = require('url'),
    app = connect();

//app.use(qs);

app.use(function (req, res) {
    res.end(JSON.stringify(qs.parse(url.parse(req.url).query)));
});

app.listen(8080);