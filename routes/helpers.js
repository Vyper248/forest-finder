var helpers = {};

helpers.getRatingObject = function(forest, user){
	var ratingObject = {};
	if (forest.ratings && forest.ratings.length > 0){
		var userRating = 0;
		//array of ratings without user information
		var allRatings = forest.ratings.map(function(obj){
			if (user && obj.username === user.username) userRating = obj.rating;
			return obj.rating;
		});
		var average = allRatings.reduce(function(t,c){return t+=c;})/allRatings.length;
            average = (Math.round(average*2)/2).toFixed(1);

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

module.exports = helpers;
