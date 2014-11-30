var url = require('url');

var nano = require('nano');
var couchdb = nano('http://localhost:5984');

var formidable = require('formidable');
var BufferedStream = require('bufferedstream');

startServer();
    
function startServer() {
    var chatDB = couchdb.use('chat');
    var userDB = couchdb.use('users');
    
    var http = require('http').createServer(handler);
    var io = require('socket.io')(http);
    var fs = require('fs');
    
    http.listen(4000);

// serves up index.html no matter what comes after :4000
    function handler(req, res) {
        var username;
        // if a new avatar was posted, insert it into the database
        if(req.method === 'POST' && req.url.indexOf('/avatar') === 0){
            var currentUserDocRev;
            console.log('got avatar');
            
            var bufferedRequest = new BufferedStream();
            bufferedRequest.headers = req.headers;
            bufferedRequest.pause();  // pause the stream while the user is inserted or retrieved
            
            // pipe the request into the buffer
            req.pipe(bufferedRequest);   
            
            // parse username
            console.log(url.parse(req.url).query);
            username = url.parse(req.url, true).query.username; 
            
            // insert the user into the database 
            userDB.insert({username: username}, username, function (err, user) {
                if(err) {
                    // if the code is 409, user exists, get the user revision 
                    if(err.status_code === 409) {
                        userDB.get(username, function (err, user) {
                            if(err) {
                                console.error(err);
                                res.writeHead(500);
                                return res.end(JSON.stringify(err));
                            }
                            
                            currentUserDocRev = user._rev;
                            console.log('user revision is ', currentUserDocRev);
                            bufferedRequest.resume();  // resume the request now that we have the revision
                        });
                        // returns from the insert since it failed and a get is currently being done
                        return; 
                    }
                    else { // error occurred
                        res.writeHead(500);
                        return res.end(JSON.stringify(err));
                    }
                }
                
                // no error so user was inserted
                console.log('username inserted, rev = ', user.rev);
                currentUserDocRev = user.rev;
                bufferedRequest.resume();
                
            });
            
            // handle the avatar upload
            console.log('starting avatar upload handling')
            var form = new formidable.IncomingForm();
            form.encoding = 'utf8';
            form.parse(bufferedRequest);
            console.log('parsed the buffer');
            
            // override the onPart function.  called by the onHeaderEnd
            form.onPart = function(part) {
                if(part.name !== 'avatar') {
                    return;
                }
                console.log(part);
                
                var attachment = userDB.attachment.insert(username, 'avatar', 
                    null, part.mime, {rev: currentUserDocRev});
                
                // pipe the image file to the attachment.  After it completes, attachment will post to 
                // the DB    
                part.pipe(attachment);
                
                
                attachment.on('error', function (err) {
                    console.error(err);
                    res.writeHead(500);
                    return res.end(JSON.stringify(err));
                });
                
                attachment.on('end', function() {
                    res.end();
                });
            };
        }
        // retrieve the user's avatar
        else if(req.url.indexOf('/avatar') === 0) {
            username = url.parse(req.url, true).query.username;
            userDB.attachment.get(username, 'avatar').pipe(res);
        }
        // server up the chat index file
        else {
            fs.readFile(__dirname + '/index.html',
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading index.html');
                    }
    
                    res.writeHead(200);
                    res.end(data);
                }
            );
        }
        
    }

    function sendBackLog(socket, room) {
        var getOptions = {
            start_key: JSON.stringify([room, 99999999999999]),
            end_key: JSON.stringify([room, 0]),
            limit: 10,
            descending: true
        };

        chatDB.get('_design/designdoc/_view/by_room', getOptions, function (err, results) {
            var messages = results.rows.reverse().map(function (res) {
                return res.value
            });

            socket.emit('backlog', messages);
        });
    }
    
    var chat = io.of('/chat');

// When a client joins, add them immediately to the main room.  If this is not done, a broadcast
// from a client not in a room goes to everyone in every room
   /* chat.use(function (socket, next) {
        socket.join('Main');
        socket.room = 'Main';
        next();
    });*/

    chat.on('connection', function (socket) {
        socket.on('clientMessage', function (content) {
            
            if (!socket.username) {
                socket.username = socket.id;
            }

            var messageDoc = {
                when: Date.now(),
                from: socket.username,
                room: socket.room,
                message: content
            };
            
            // broadcast sends it to all OTHER sockets, so send it also to the socket that originally
            // sent the message
            socket.emit('serverMessage', messageDoc);
            
            // if the client has a room attribute, broadcast to that room
            if (socket.room) {
                socket.broadcast.to(socket.room);
            }

            //console.log(messageDoc);

            chatDB.insert(messageDoc, function (err) {
                if (err) {
                    console.error(err);
                }
            });
            
            socket.broadcast.emit('serverMessage', messageDoc);
        });

        socket.on('login', function (username) {
            socket.username = username;
            var message = {
                from: username,
                message: 'Logged in',
                when: Date.now()
            };
            message.type = 'self';
            socket.emit('serverMessage', message);
            message.type = 'broadcast';
            socket.broadcast.emit('serverMessage', message);
            sendBackLog(socket, socket.room);
        });

        socket.on('disconnect', function () {
            var message = {
                from: socket.username,
                message: 'Logged in',
                when: Date.now()
            };
            
            socket.broadcast.emit('serverMessage', message);
        });

        // if the join event is received, join the socket to the room
        socket.on('join', function (room) {
            var oldRoom = socket.room;
            socket.room = room;
            socket.join(room);

            if (oldRoom) {
                socket.leave(oldRoom);
            }

            var username = socket.username;
            if (!username) {
                username = socket.id;
            }

            var message = {
                from: username,
                message: 'Logged in',
                when: Date.now()
            };
            
            socket.emit('serverMessage', message);
            socket.broadcast.to(room).emit('serverMessage', message);
            sendBackLog(socket, room);
        });

        socket.emit('login');
    });
}

