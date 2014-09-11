var spawn = require('child_process').spawn;

// Spawn the child with a node process executing the plus_one app
var child = spawn('node', ['plus_one.js']);

// Call this function every 1 second:
setInterval(function() {
    // create a random number smaller than 10.000
    var number = Math.floor(Math.random() * 10000);

    // send that number to the child process:
    child.stdin.write(number + "\n");

    // get the response from the child and print it
    child.stdout.once('data', function (data) {
        console.log('child replied to ' + number + ' with: ' + data);
    });
}, 1000);

child.stderr.on('data', function (data) {
   process.stdout.write(data);
});

