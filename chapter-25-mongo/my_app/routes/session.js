var express = require('express');
var router = express.Router();
var User = require('../data/models/user');
var notLoggedIn = require('./middleware/not_logged_in');

// a logged in user should not be able to try to log in again
router.get('/new', notLoggedIn, function (req, res) {
    res.render('session/new', {title: 'Log in'});
});

// page results from log in click.  If the user somehow got to the log in screen, but was already
// logged in, restrict access.
router.post('/', notLoggedIn, function (req, res) {
    // retrieve the user from the database
    User.findOne({username: req.body.username, password: req.body.password},
        function (err, user) {
            if(err) {return next(err);}

            if(user) {
                req.session.user = user;
                res.redirect('/users');
            }
            else {
                res.redirect('/session/new');
            }
        }
    );
});

router.delete('/', function (req, res, next) {
    req.session.destroy();
    res.redirect('/users');
});

module.exports = router;