var async = require('async'),
    request = require('request'),
    workArray = Array();

function done(err, results) {
    if(err) {
        throw err;
    }

    console.log('results: %j', results);
}

var maximumConcurrency = 100;

function worker(task, callback) {
    request.post({
        uri: 'http://localhost:8080',
        body: JSON.stringify(task)
    },
    function(err, res, body){
        callback(err, body && JSON.parse(body));
    });
}

var queue = async.queue(worker, maximumConcurrency);

queue.saturated = function () {
    console.log('queue is full');
}

for(var i = 0; i < 11; i++) {
    workArray.push(i);
}

workArray.forEach(function(i){
    queue.push(i, function (err, result) {
        if(err) {
            throw err;
        }

        console.log(i + '^2 = %d', result);
    });
});