var mongoose = require("mongoose");

var forestSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	lon: Number,
	lat: Number,
	created: {type: Date, default: Date.now},
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
	],
	ratings: [
		{
			username: String,
			rating: Number
		}
	]
});

module.exports = mongoose.model("Forest", forestSchema);
