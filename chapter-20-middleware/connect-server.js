var connect = require('connect'),
    http = require('http'),
    replyText = require('./generic'),
    writeHeader = require('./writeHeader'),
    saveRequest = require('./save_to_file'),
    errorCreator = require('./error_next'),
    errorHandler = require('./error_handler');

var app = connect()
    .use(errorCreator())
    .use(saveRequest(__dirname + '/requests'))
    .use(writeHeader('X-Powered-By', 'Node'))
    .use(replyText('Hello everyone!'))
    .use(errorHandler());

http.createServer(app).listen(8080);