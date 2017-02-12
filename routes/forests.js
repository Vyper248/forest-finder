var express = require('express');
var routes = express.Router();
var Comment = require('../models/comment');
var Forest = require('../models/forest');
var middle = require('./middleware');

//INDEX - Index of current forests
routes.get('/forests', function(req, res){
	global.desiredRoute = req.route.path;
	Forest.find({},function(err, forests){
		if (err) return handleError(err);
		forests = forests.sort(function(a,b){return a.created - b.created});
		res.render('index', {forests: forests});
	});
});

//CREATE - new forest
routes.post('/forests', middle.isLoggedIn, function(req, res){
	//get data from form and add to forest collection
    var newForest = req.body;
    newForest.user = {username: req.user.aUsername, id: req.user._id};
	Forest.create(newForest, function(err){
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/forests');
		}
		req.flash('success', 'Forest successfully created!');
		return res.redirect('/forests');
	});
});

//NEW - form to create forest
routes.get('/forests/new', middle.isLoggedIn, function(req, res){
	res.render('newForest');
});

//SHOW - show more information for a forest (has to be after /forests/new)
routes.get('/forests/:id', function(req, res){
	//global.desiredRoute = '/forests/'+req.params.id;
	var id = req.params.id;
	Forest.findById(id).populate('comments').exec(function(err, forest){
		if (err){
			console.log(err);
			req.flash('error','This forest could not be found.');
			return res.redirect('/forests');
		}
		var ratings = getRatingObject(forest, req.user);
		console.log(ratings);
		return res.render('show',{forest:forest, ratings: ratings});
	});
});

function getRatingObject(forest, user){
	var ratingObject = {};
	if (forest.ratings && forest.ratings.length > 0){
		var userRating = 0;
		//array of ratings without user information
		var allRatings = forest.ratings.map(function(obj){
			if (user && obj.username === user.username) userRating = obj.rating;
			return obj.rating;
		});
		var average = allRatings.reduce(function(t,c){return t+=c;})/allRatings.length;
		var starRatings = [];
		for(var i = 1; i <= 5; i++){
			var starRating = allRatings.filter(function(num){return num === i}).length;
			starRatings.push(starRating);
		}
		
		ratingObject.totalRatings = allRatings.length;
		ratingObject.starRatings = starRatings;
		ratingObject.userRating = userRating;
		ratingObject.allRatings = allRatings;
		ratingObject.average = average;
	}

	return ratingObject;
}

//EDIT - edit a forest page
routes.get('/forests/:id/edit', middle.isLoggedIn, middle.isOwnerOfForest, function(req, res){
	Forest.findById(req.params.id, function(err, forest){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/forests/'+req.params.id);
		}
		return res.render('editForest', {forest: forest});
	});
});

//UPDATE - update a forest and redirect
routes.put('/forests/:id', middle.isLoggedIn, middle.isOwnerOfForest, function(req, res){
	Forest.findByIdAndUpdate(req.params.id, req.body, function(err, forest){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/forests/'+req.params.id);
		}
		req.flash('success', 'Forest has been successfully updated.');
		return res.redirect('/forests/'+req.params.id);
	});
});

//DELETE - delete a forest page - needs to remove comments too
routes.delete('/forests/:id', middle.isLoggedIn, middle.isOwnerOfForest, function(req, res){
	Forest.findById(req.params.id, function(err, forest){
		Comment.remove({_id : {$in: forest.comments}}, function(err){
			if (err) console.log(err);
		});

		forest.remove(function(err){
			if (err){
				console.log(err);
				req.flash('error', 'There was a problem deleting the forest.');
				return res.redirect('/forests');
			}
			req.flash('success', 'Forest has been deleted.');
			return res.redirect('/forests');
		});
	});
});

module.exports = routes;
