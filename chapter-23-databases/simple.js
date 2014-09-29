// simple test of mysql database connection

var mysql = require('mysql');

var client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.argv[2]
});

client.connect(function (err) {
    console.log(err);
});

client.query('select "Hello world!"', function (err, results, fields) {
    console.log(results);
    console.log(fields);
    client.end();
});