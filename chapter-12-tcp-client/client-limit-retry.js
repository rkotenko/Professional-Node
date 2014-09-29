/*
 This client tries to reconnect but only a max of 4 times and each time is only
 after 2 seconds
 */

var net = require('net'),
    port = 4000,
    conn,
    retryInterval = 2000,
    retriedTimes = 0,
    maxRetries = 4,
    quitting = false;

// stdin starts in a paused state, so it needs to be resumed to be used
process.stdin.resume();

// monitor the client input for the quit command or data
process.stdin.on('data', function (data) {
    if(data.toString().trim().toLowerCase() === 'quit') {
        quitting = true;
        console.log('quitting...');
        conn.end()
        process.stdin.end() // the client is quitting, so close down the stream
    }
    else {
        conn.write(data)
    }
});

(function connect() {
    function reconnect() {
        if(retriedTimes >= maxRetries) {
            throw new Error('Max retries have been exceeded, I give up.');
        }

        retriedTimes += 1;
        setTimeout(connect, retryInterval);
    }

    // conn is a socket so it is readable and writable
    conn = net.createConnection(port);

    conn.on('connect', function () {
        retriedTimes = 0;
        console.log('connected to the server, type "quit" to end connection');
    });

    conn.on('error', function (err) {
        if(err.code === 'ECONNREFUSED') {
            console.log('connection was refused')
        }
        else {
            console.log('Error in connection:', err);
        }
    });

    conn.on('close', function () {
        if(!quitting) {
            console.log('connection got closed, will try to reconnect, attempt # ' + retriedTimes);
            reconnect();
        }
    });

    conn.pipe(process.stdout, {end: false});
})();