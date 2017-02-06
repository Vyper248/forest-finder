var mongoose = require("mongoose");

var forestSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	lon: Number,
	lat: Number,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Forest", forestSchema);
