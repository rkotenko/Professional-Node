var express = require('express');
var router = express.Router();
var User = require('../data/models/user');
var notLoggedIn = require('./middleware/not_logged_in');
var loadUser = require('./middleware/load_user.js'); // loads the user into the request
var restrictUserToSelf = require('./middleware/restrict_user_to_self.js');
var async = require('async');
var maxUsersPerPage = 5;

/*
    In app.js, these routes are relative to /user, so no need to use /user in the router.verb methods
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
    // create a pagination variable
    var page = req.query.page && parseInt(req.query.page, 10) || 0;
    
    async.parallel([
        function(next) {
            User.count(next);
        },
        function(next) {
            User.find({})
                .sort('name') // get all the users sorted by name ascending (minus sign for descending)
                .skip(page * maxUsersPerPage)
                .limit(maxUsersPerPage)
                .exec(next);   
        }],
        // final callback; results has the return of all parallel functions
        // in this case, count and the users
        function (err, results) {
            if(err) {
                return next(err);
            }  
            
            var count = results[0]; // it was the first function in the async list
            var users = results[1];
            var lastPage = (page + 1) * maxUsersPerPage >= count;
    
            res.render('users/index', {
                title: 'User List',
                users: users,
                page: page,
                lastPage: lastPage
            });
        }
    ); 
});

// GET new user form
router.get('/new', notLoggedIn, function (req, res) {
    res.render('users/new', {title: "New User"});
});

// GET particular user by :name
router.get('/:name', loadUser, function (req, res, next) {
    // req.params can be used when the route has a variable like :name
    
    // get the last 5 articles by the user using the User model method
    req.user.getArticles(function (err, articles) {
        if(err) {return next(err);}
        res.render('users/profile', {
            title: 'User profile', 
            user: req.user,
            articles: articles});
    });
    
});

// POST a new user
router.post('/', notLoggedIn, function (req, res, next) {
    // bodyParser provides the body attribute to the request
    User.create(req.body, function (err) {
        if(err) {
            if(err.code === 11000) {
                res.send('Conflict', 409);
            }
            else {
                if(err.name === "ValidationError") {
                    return res.send(Object.keys(err.errors).map(function (errField) {
                        return err.errors[errField].message;
                    }).join('. '), 406);        
                }
                else {
                    next(err);
                }
            }
            return;
        }
        res.redirect('/users')
    });
});

// DELETE delete a user
router.delete('/:name', loadUser, restrictUserToSelf, function (req, res, next) {
    // user is a mongoose document which is an instance of the model and has access
    // to its methods including remove
    req.user.remove(function (err) {
        if(err) {return next(err);}
        res.redirect('/users');
    });
});

module.exports = router;
