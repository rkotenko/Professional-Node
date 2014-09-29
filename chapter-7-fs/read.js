var fs = require('fs - chapter 7');
fs.open('./test.txt', 'r', function opened(err, fd){
    if (err) {throw err;}
    var readBuffer = new Buffer(1024),
        bufferOffset = 0,
        bufferLength = readBuffer.length,
        filePosition = 0;

    fs.read(fd, readBuffer, bufferOffset, bufferLength, filePosition,
            function read(err, readBytes){
                if (err) {throw err;}
                console.log('just read ' + readBytes + ' bytes');
                if(readBytes > 0) {
                    console.log(readBuffer.slice(0, readBytes));
                }
            });
});