function errorCreator() {
    return function (req, res, next) {
        // pass the error through the connect module
        next(new Error('This is an error'));
    }
}

module.exports = errorCreator;