var Comment = require('../models/comment');
var Forest = require('../models/forest');

var middlewareObject = {};

middlewareObject.ownsComment = function(req, res, next){
	Comment.findById(req.params.commentId, function(err, comment){
		if (err){
			console.log(err);
			return res.redirect('/forests/'+req.params.id)
		}
		if (comment.user.id.equals(req.user._id)){
			return next();
		} else {
			return res.redirect('/forests/'+req.params.id);
		}
	});
};

middlewareObject.isOwnerOfForest = function(req, res, next){
	Forest.findById(req.params.id, function(err, forest){
		if (err){
			console.log(err);
			return res.redirect('/forests/'+req.params.id);
		}
		if (forest.user.id.equals(req.user._id)){
			return next();
		} else {
			return res.redirect('/forests/'+req.params.id);
		}
	});
};

middlewareObject.isCurrentUser = function(req, res, next){
	if  (req.params.username.toLowerCase() === req.user.username){
		next();
	} else {
		req.flash("error","You cannot access another users profile page.");
		res.redirect('/forests');
	}
};

middlewareObject.isLoggedIn = function(req, res, next){
	global.desiredRoute = req.route.path;
	if (global.desiredRoute.indexOf(":id") !== -1){
		global.desiredRoute = global.desiredRoute.replace(":id",req.params.id);
	}
	if (global.desiredRoute.indexOf(":username") !== -1){
		global.desiredRoute = global.desiredRoute.replace(":username",req.params.username);
	}

	if (req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You need to log in first!');
	res.redirect('/login');
};

module.exports = middlewareObject;
