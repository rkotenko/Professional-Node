var spawn = require('child_process').spawn;

// spawn the child with a ls -la command
var child = spawn('ls', ['no']);

child.stdout.on('data', function (data) {
   console.log('data from child: ' + data);
});

// when child exits:
child.on('exit', function (code) {
    console.log('child process terminated with code ' + code);
});