var express = require('express');
var router = express.Router();
var Forest = require('../models/forest');
var middleware = require('./middleware');

router.post('/forests/:id/ratings', middleware.isLoggedIn, function(req, res){
    var forestID = req.params.id;
    //make sure the user field hasn't been changed, so can only add a rating
    //as the currently signed in user
    if (req.body.user === req.user.username){
        if (req.body.rating > 5) req.body.rating = 5;
        if (req.body.rating < 1) req.body.rating = 1;
        req.body.rating = parseInt(req.body.rating);

        Forest.findById(forestID, function(err, forest){
            if (err) console.log(err);

            if (forest.ratings === undefined) forest.ratings = [];

            var currentRating = forest.ratings.filter(function(obj){
                return obj.username === req.user.username;
            });
            if (currentRating.length === 0){
                //can't find a rating for this user, so create one
                var newRating = {username: req.user.username, rating: req.body.rating};
                forest.ratings.push(newRating);
                forest.save(function(err){
                    if (err) {
                        console.log(err);
                        res.send('false');
                    } else {
                        res.send('true');
                    }
                });
            } else {
                //found a rating, so adjust it
                currentRating[0].rating = req.body.rating;
                forest.save(function(err){
                    if (err) {
                        console.log(err);
                        res.send('false');
                    } else {
                        res.send('true');
                    }
                });
            }
        });
    } else {
        res.send('false');
    }
});

module.exports = router;
