const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	seedDB = require('./seeds'),
	passport = require('passport'),
	passportStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	expressSession = require('express-session'),
	methodOverride = require('method-override');

//used within the route files when logging in
global.desiredRoute = '/forests';

//REQUIRE ROUTES
var commentRoutes = require('./routes/comments');
var authRoutes = require('./routes/auth');
var forestRoutes = require('./routes/forests');
var userRoutes = require('./routes/users');
var ratingRoutes = require('./routes/ratings');

//SETUP
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//DATABASE CONNECTION AND SEED=============================
//seedDB();
var databaseURL = process.env.DATABASEURL || 'mongodb://localhost/forests';
mongoose.connect(databaseURL);

//MODELS===================================================
var Forest = require('./models/forest');
var Comment = require('./models/comment');
var User = require('./models/user');

//PASSPORT SETUP===========================================
app.use(expressSession({
	secret: 'ztnqp29g7320cn23c9mf0',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass current user into every route - middleware
app.use(function(req, res, next){
	res.locals.user = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//ROUTES====================================================
//home page
app.get('/', function(req, res){
	res.render('landing');
});

app.use(forestRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(ratingRoutes);

app.get('/*', function(req, res){
	req.flash("error","Error 404: The page you requested could not be found.");
	res.redirect("/forests");
});

//LISTEN====================================================
var port = process.env.PORT || 34862;
var ip = process.env.IP;
app.listen(port, ip, function(){
	console.log('Forest server started on port '+port);
});
