// a little more complex example showing mysql usage, including creating a database, tables, insertion,
// updating, and listening to the events emitted by the query
var mysql = require('mysql');

var client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.argv[2]
});

client.connect();

client.query('drop database if exists node');
client.query('create database node');
client.query('use node');
client.query('create table test' +
             '(id int(11) auto_increment, ' +
             'content varchar(255), ' +
             'primary key(id))'
);

for(var i = 0; i < 10000; i++) {
    client.query('insert into test (content) values(?)', ['content for row ' + (i + 1)]);
}

client.query('update test set content = ? where id >= ?', 
             ['new content', 9000], 
             function (err, info) {
                if(err) {
                    throw err;
                }
                console.log('Changed content of ' + info.affectedRows + ' rows');
             }
);

var query = client.query('select id, content from test where id >= ? and id <= ?', [8990, 9010]);

query.on('error', function (err) {
    throw err;
});

query.on('result', function (row) {
    console.log('Content of row #' + row.id + ' is: "' + row.content + '"');
});

query.on('end', function (result) {
    console.log('Finished retrieving results')
});

client.end();