var connect = require('connect'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

var app = connect()
    .use(morgan(':method :req[content-type]'))
    .use(bodyParser.json());

app.use(function (req, res) {
   res.end(JSON.stringify(req.body));
});

app.listen(8080);
    