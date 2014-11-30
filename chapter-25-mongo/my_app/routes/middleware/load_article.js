var Article = require('../../data/models/article');

function loadArticle(req, res, next) {
    Article.findOne({title: req.params.title})
        // loads the author with the proper user since the schema links it to the User collection
        .populate('author') 
        .exec(function (err, article) {
            if(err) {return next(err);}
            if(!article) {
                return res.send('Not found', 404);
            }
            req.article = article;
            next();
        });
}

module.exports = loadArticle;