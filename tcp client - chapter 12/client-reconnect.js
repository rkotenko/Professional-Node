/*
 This client is only meant to show how the client will try to reconnect whenever the
 connection to the server is lost.  It is not robust, as a client should not just keep
 trying forever.
*/

var net = require('net'),
    port = 4000,
    conn;

// stdin starts in a paused state, so it needs to be resumed to be used
process.stdin.resume();

(function connect() {
    // conn is a socket so it is readable and writable
    conn = net.createConnection(port);

    conn.on('connect', function () {
        console.log('connected to the server');
    });

    conn.on('error', function (err) {
        console.log('Error in connection:', err);
    });

    conn.on('close', function () {
        console.log('connection got closed, will try to reconnect');
        connect();
    });

    // end ensures that stdout stays writable, otherwise end() will be called on it
    // this prints out the stream from the server
    conn.pipe(process.stdout, {end: false});
    process.stdin.pipe(conn);
})();