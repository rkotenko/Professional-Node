var fs = require('fs - chapter 7');
fs.open('./test.txt', 'a', function opened(err, fd){
    if (err) {throw err;}
    var writeBuffer = new Buffer('there are more words here'),
        bufferPosition = 0,
        bufferLength = writeBuffer.length,
        filePosition = null;

    fs.write(fd, writeBuffer, bufferPosition, bufferLength, filePosition,
            function wrote(err, written){
                if (err) {throw err;}
                console.log('wrote ' + written + ' bytes');

            });
});