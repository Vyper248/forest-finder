var express = require('express');
var routes = express.Router();
var User = require('../models/user');
var passport = require('passport');

//AUTHENTICATION ROUTES

//Register Form
routes.get('/register', function(req, res){
	res.render('register');
});

//Register Post
routes.post('/register', function(req, res){
	if (req.body.username.length < 2) {
		req.flash('error', 'Username is too short, must be 2 or more characters!');
		res.redirect('/register');
		return;
	}
	if (req.body.password.length < 8) {
		req.flash('error', 'Password is too short, must be 8 or more characters!');
		res.redirect('/register');
		return;
	}

	var newUser = new User({username: req.body.username, aUsername: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err){
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		}

		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to Forest Finder '+req.body.username);
			res.redirect('/forests');
		});
	});
});

//Login Form
routes.get('/login', function(req, res){
	res.render('login');
});

//Login Post
routes.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: "Incorrect username or password, please try again."
}), function(req, res){
	req.flash('success', 'Welcome to Forest Finder '+req.user.aUsername+'!');
	res.redirect(global.desiredRoute);
});

//Logout
routes.get('/logout', function(req, res){
	req.flash('success', 'Goodbye '+req.user.aUsername+', hope to see you again soon!');
	req.logout();
	res.redirect('back');
});

module.exports = routes;
