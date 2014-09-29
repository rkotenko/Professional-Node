var request = require('request'),
    inspect = require('util').inspect;

request.post(
    'http://localhost:4001/abc/def',
    function (err, res, body) {
        if(err) {throw err;}
        console.log({
            err: err,
            res: {
                statusCode: res.statusCode
            },
            body: JSON.parse(body)
        });
    }
);