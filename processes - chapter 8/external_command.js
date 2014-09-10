var exec = require('child_process').exec;

exec('cat *.js', function(err, stdout, stderr){
    if (err) {
        // error lauching process
        console.log('child process exited with error code', err.code);
        returnl
    }

    console.log(stdout);
});