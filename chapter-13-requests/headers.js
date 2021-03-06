// request that redirects to /

var request = require('request'),
    inspect = require('util').inspect;

var options = {
    url: 'http://localhost:4001/abc/def',
    method: 'PUT',
    headers: {
        'X-My-Header': 'value'
    }
};

request(options, function (err, res, body) {
        if(err) {throw err;}
        console.log(inspect({
            err: err,
            res: {
                statusCode: res.statusCode
            },
            body: JSON.parse(body)
        }));
    }
);