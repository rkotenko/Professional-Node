var async = require('async'),
    request = require('request'),
    collection = [1, 2, 3, 4, 5];

function done(results){
    console.log('The first element on %j whose square value is greater than 10: %j',
        collection,
        results);
}

function test(value){
    return value > 10;
}

function detect(item, callback) {
    request.post({
        uri: 'http://localhost:8080',
        body: JSON.stringify(item)
    },
    function(err, res, body) {
        if(err) {
            throw err;
        }
        callback(test(JSON.parse(body)));
    });
}

async.detect(collection, detect, done);