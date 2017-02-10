var express = require('express');
var routes = express.Router();
var Comment = require('../models/comment');
var Forest = require('../models/forest');
var middle = require('./middleware.js');

//CREATE Comment
routes.post('/forests/:id/comments', middle.isLoggedIn, function(req, res){
	var forestID = req.params.id;
	var commentInfo = req.body;
	commentInfo.user = {username:req.user.aUsername, id:req.user._id};//shows actual username (not lowercase)
	Forest.findById(forestID, function(err, forest){//get current forest
		if (err) handleError(err);
		Comment.create(commentInfo, function(err, comment){//create comment
			if (err) handleError(err);
			forest.comments.push(comment);//save comment to forest as reference
			forest.save(function(err){
				if (err) handleError(err);
				res.redirect('/forests/'+req.params.id);
			});
		});
	});
});

//UPDATE COMMENT
routes.put('/forests/:id/comments/:commentId', middle.isLoggedIn, middle.ownsComment, function(req, res){
	Comment.findByIdAndUpdate(req.params.commentId, req.body, function(err, comment){
		if (err){
			console.log(err);
			return res.send('false');
		}
		return res.send('true');
	});
});

//DELETE COMMENT - and remove from forest object too
routes.delete('/forests/:id/comments/:commentId', middle.isLoggedIn, middle.ownsComment, function(req, res){
	Forest.findById(req.params.id, function(err, forest){
		if (err) console.log(err);
		//get index of commentID in forest.comments array and remove it
		var comIdx = forest.comments.indexOf(req.params.commentId);
		forest.comments.splice(comIdx, 1);
		forest.save();
	});

	Comment.findByIdAndRemove(req.params.commentId, req.body, function(err, comment){
		if (err){
			console.log(err);
			return res.send('false');
		}
		return res.send('true');
	});
});

module.exports = routes;
