// request that redirects to /

var request = require('request'),
    inspect = require('util').inspect;

var body = {
    a: 1,
    b: 2
}

var options = {
    url: 'http://localhost:4001/print/body',
    form: body

};

request(options, function (err, res, body) {
        if(err) {throw err;}
        console.log(inspect({
            err: err,
            res: {
                statusCode: res.statusCode,
                headers: res.headers
            },
            body: JSON.parse(body)
        }));
    }
);