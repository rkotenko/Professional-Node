var connect = require('connect'),
    errorHandler = require('errorhandler'),
    app = connect();

app.use(function (req, res, next) {
    next(new Error('Hey!'));
});

// response
app.use(function (req, res) {
    res.end('Hello there!');  // 'world' is so 20th century
});

app.use(errorHandler);
app.listen(8080);