#!/usr/bin/env node

var dgram = require('dgram'),
    client = dgram.createSocket('udp4'),
    host = process.argv[2],
    port = parseInt(process.argv[3], 10);

// unpause the stdin
process.stdin.resume();

process.stdin.on('data', function (data) {
    client.send(data, 0, data.length, port, host);
});

client.on('message', function (message) {
    console.log('Got message back:', message.toString());
});
