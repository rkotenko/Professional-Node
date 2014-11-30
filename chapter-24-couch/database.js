var nano = require('nano');
var couchdb = nano('http://localhost:5984');

var couchMapReduce = function(doc) {
    emit([doc.room, doc.when], doc)
};

couchdb.db.create('chat', function (err) {
    if(err && err.status_code !== 412) {console.error(err);}

    // create a user database
    couchdb.db.create('users', function (err) {
        if(err && err.status_code !== 412) {console.error(err);}

        var designDoc = {
            language: "javascript",
            views: {
                by_room: {
                    map: couchMapReduce
                }
            }
        };

        var chatDB = couchdb.use('chat');

        (function insertOrUpdateDesignDoc() {
            chatDB.insert(designDoc, '_design/designdoc', function(err) {
                if(err) {
                    if(err.status_code === 409) {
                        chatDB.get('_design/designdoc', function (err, ddoc) {
                            if(err) { return console.error(err);}
                            designDoc._rev = ddoc._rev;
                            insertOrUpdateDesignDoc();
                        });
                    }
                    else {
                        return console.error(err);
                    }
                }
                else {
                    console.log('design inserted!')
                }

            });
        }());
    });
});