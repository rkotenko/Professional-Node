var spawn = require('child_process').spawn;

var child = spawn('tail', ['-f', '/var/log/system.log']);

// print the child output to the console
child.stdout.on('data', function(data){
    console.log('tail output: ' + data);
});

child.stderr.on('data', function(data){
    console.log('tail output: ' + data);
});