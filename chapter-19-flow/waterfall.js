var async = require('async'),
    request = require('request');

function done(err, res, body) {
    if(err) {
        throw err;
    }

    console.log('3^4 = %d', body);
}

async.waterfall([
    function(next) {
        request.post({
            uri: 'http://localhost:8080',
            body: '3'
        }, next);
    },
    // these are the callback params from request.post plus the call to the next function in
    // the waterfall
    function(res, body, next) {
        request.post({
            uri: 'http://localhost:8080',
            body: body
        }, next);
    }
], done);