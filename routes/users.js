var express = require('express');
var routes = express.Router();
var middle = require('./middleware');

routes.get('/users/:username', middle.isLoggedIn, middle.isCurrentUser, function(req, res){
    res.render('showUser');
});

module.exports = routes;
