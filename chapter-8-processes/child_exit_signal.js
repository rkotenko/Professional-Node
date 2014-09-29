var spawn = require('child_process').spawn;

// spawn the child with a ls -la command
var child = spawn('sleep', ['10']);

setTimeout(function () {
    child.kill();
}, 1000);

// when child exits:
child.on('exit', function (code, signal) {
    if(code) {
        console.log('child process terminated with code ' + code);
    }
    else if (signal) {
        console.log('child process terminated because of signal ' + signal)
    }
});