var express = require('express');
var router = express.Router();
var users = require('../data/users');
var notLoggedIn = require('./middleware/not_logged_in');
var loadUser = require('./middleware/load_user.js'); // loads the user into the request
var restrictUserToSelf = require('./middleware/restrict_user_to_self.js');

/*
    In app.js, these routes are relative to /user, so no need to use /user in the router.verb methods
*/

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('users/index', {title: 'User List', users: users});
});

// GET new user form
router.get('/new', notLoggedIn, function (req, res) {
    res.render('users/new', {title: "New User"});
});

// GET particular user by :name
router.get('/:name', loadUser, function (req, res, next) {
    // params can be used when the route has a variable like :name
    res.render('users/profile', {title: 'User profile', user: req.user});
});

// POST a new user
router.post('/', notLoggedIn, function (req, res) {
    // bodyParser provides the body attribute to the request
    if(users[req.body.username]) {
        res.send('Conflict', 409);
    }
    else {
        // store the new user into the json and redirect to the users index
        users[req.body.username] = req.body;
        res.redirect('/users');
    }
});

// DELETE delete a user
router.delete('/:name', loadUser, restrictUserToSelf, function (req, res, next) {
    delete users[req.params.name];
    res.redirect('/users');
});

module.exports = router;
