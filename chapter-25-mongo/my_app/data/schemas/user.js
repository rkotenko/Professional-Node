var mongoose = require('mongoose');
var request = require('request');

var TIMESPAN_YEAR = 31536000000;
var TIMESPAN_18_YEARS = 18 * TIMESPAN_YEAR;

function validate_18_years_old_or_more(date) {
    return(Date.now() - date.getTime()) > TIMESPAN_18_YEARS;
}

// async validate.  done is used to return whether the validation passed or not
function twitterHandleExists(handle, done) {
    request('http://twitter.com/' + encodeURIComponent(handle), function (err, res) {
        if(err) {
            console.log(err);
            return done(false);
        }
        if(res.statusCode > 299) {
            done(false);
        }
        else {
            done(true);
        }
    });
}

// filter the twitter handle so that even if an @ exists in the db, it is stripped out of the model
function filterTwitterHandle(handle) {
    if(!handle) {
        return;
    }

    handle = handle.trim();
    if(handle.indexOf('@') === 0) {
        handle = handle.substring(1);
    }
    return handle;
}

// simple but incomplete email regexp; simple match of string@string.string
var emailRegexp = /.+\@.+\..+/;

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    name: mongoose.Schema.Types.Mixed,
    password: String,
    email: {
        type: String,
        sparse: true,
        unique: true,
        match: emailRegexp
    },
    gender: {
        type: String,
        required: true,
        uppercase: true,
        'enum': ['M', 'F']
    },
    birthday: {
        type: Date,
        validate: [
            validate_18_years_old_or_more,
            'You must be 18 years old or more'
        ]
    },
    twitter: {
        type: String,
        sparse: true,
        validate: [twitterHandleExists, 'Please provide a valid twitter handle'],
        set: filterTwitterHandle,
        get: filterTwitterHandle
    },
    meta: {
        created_at: {
            type: Date,
            'default': Date.now,
            // this set ensures that a user cannot somehow modify the create date
            set: function (val) {
                return undefined;
            }
        },
        updated_at: {
            type: Date,
            'default': Date.now
        }
    }
});

// ensure that the default values of meta are used by attached a pre event
// if the record is new, created_at and updated_at are both undefined so
// once saved they get the defaults.  If not new, this applies to just updated_at
UserSchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.created_at = undefined;
    }
    
    this.meta.updated_at = undefined;
    next();
});

// virtual attribute for the user full name
UserSchema
    .virtual('full_name')
    .get(function () {
        if(typeof this.name === 'string') {
            return this.name;
        }
        return [this.name.first, this.name.last].join(' ');
    })
    .set(function (fullName) {
        var nameComponents = fullName.split(' ');
        
        this.name = {
            last: nameComponents.pop(),
            first: nameComponents.join(' ')
        };
    });
    
// set up a virtual attribute for the user twitter handle
UserSchema
    .virtual('twitter_url')
    .get(function () {
        if(this.twitter) {
            return 'http://twitter.com' + encodeURIComponent(this.twitter);
        }
    });

// create an index of username ascending and created_at descending
UserSchema.index({username: 1, 'meta.created_at': -1});

// add a method to the schema to allow the last 5 articles by the user
// to be retrieved.

UserSchema.method('getArticles', function(callback) {
    return this.model('Article')
        .find({author: this._id})
        .sort('created_at')
        .limit(5)
        .exec(callback);
});

module.exports = UserSchema;