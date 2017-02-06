var mongoose = require("mongoose");
var Forest = require("./models/forest");
var Comment = require("./models/comment");

var data = [
	{
		name: "Forest",
		image: "https://farm9.staticflickr.com/8292/7879971960_ca07618f16.jpg",
		description: "Cool forest with loads of trees!!",
		lat: 52.28,
		lon: -0.66,
		comments:[]
	},
	{
		name: "Forest 2",
		image: "https://farm4.staticflickr.com/3811/8993139225_575ca3fb17.jpg",
		description: "Cool forest with loads of trees!!",
		lat: 51.5,
		lon: 0.2,
		comments:[]
	},
	{
		name: "Forest 3",
		image: "https://farm3.staticflickr.com/2620/3924238584_cfa4642c5c.jpg",
		description: "Cool forest with loads of trees!!",
		lat: 51.5,
		lon: 0.2,
		comments:[]
	},
	{
		name: "Forest 4",
		image: "https://farm2.staticflickr.com/1083/810572442_8a1e04fcbc.jpg",
		description: "Cool forest with loads of trees!!",
		lat: 51.5,
		lon: 0.2,
		comments:[]
	}

];

function seed() {
	//mongoose.connect("mongodb://localhost/forests");

	Forest.remove({}, function(err){
		if (err) handleError(err);

		data.forEach(function(forest){
			Forest.create(forest, function(err, forest){
				//console.log(forest);
				// Comment.create({
				// 	content: "This is a cool forest!!",
				// 	user: "Bob",
				// 	created: Date.now()
				// },function(err,comment){
				// 	if (err) console.log(err);
				// 	forest.comments.push(comment);
				// 	forest.save();
				// 	//console.log(forest);
				// });
			});
		});
	});
}

module.exports = seed;
