function writeHeader(name, value) {
    // req and res are sent to all middleware for connect.
    // Next sends req and res to the next function in the middleware.  This must always be included
    // if there is more middleware to run
    return function(req, res, next){
        res.setHeader(name, value);
        next();
    };
}

module.exports = writeHeader;