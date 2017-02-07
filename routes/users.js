var express = require('express');
var routes = express.Router();
var middle = require('./middleware');
var Forest = require('../models/forest');

routes.get('/users/:username', middle.isLoggedIn, middle.isCurrentUser, function(req, res){
    Forest.find({'user.username': req.user.aUsername}, function(err, forests){
        res.render('showUser', {forests: forests});
    });
});

module.exports = routes;
