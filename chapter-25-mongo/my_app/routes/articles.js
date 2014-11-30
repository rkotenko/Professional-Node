var express = require('express');
var router = express.Router();
var async = require('async');
var Article = require('../data/models/article.js');
var loggedIn = require('./middleware/logged_in');
var loadArticle = require('./middleware/load_article');
var maxArticlesPerPage = 5;

router.get('/', function(req, res, next) {
    var page = req.query.page && parseInt(req.query.page, 10) || 0;
    
    async.parallel([
        function(next) {
            Article.count(next);
        },
        function(next) {
            Article.find({})
                .sort('title')
                .skip(page * maxArticlesPerPage)
                .limit(maxArticlesPerPage)
                .exec(next);
        }
    ],
    function(err, results) {
        if(err) {return next(err);}
        
        var count = results[0];
        var articles = results[1];
        var lastPage = (page + 1) * maxArticlesPerPage >= count;
        
        res.render('articles/index', {
            title: 'Articles',
            articles: articles,
            page: page,
            lastPage: lastPage
        });
    });
});

router.get('/new', loggedIn, function(req, res) {
    res.render('articles/new', {title: "New Article"});
});

router.get('/:title', loadArticle, function(req, res, next) {
    res.render('articles/article', {title: req.article.title, article: req.article})
});

router.post('/', loggedIn, function (req, res, next) {
    var article = req.body;
    article.author = req.session.user._id;
    Article.create(article, function (err) {
        if(err) {
            if(err.code === 11000) {
                res.send('Conflict', 409);
            }
            else {
                if(err.name === 'ValidationError') {
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
        res.redirect('/articles');
    });
});

router.delete('/:title', loggedIn, loadArticle, function (req, res, next) {
    res.article.remove(function(err) {
        if(err) {return next(err);}
        res.redirect('/articles');
    }) 
});
module.exports = router;