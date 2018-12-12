// requie mongoose
var mongoose = require("mongoose");
// Create Schema Class
var Schema  = mongoose.Schema;

// Create artivle schema
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		reuired: true
	},
	saved: {
		type: Boolean,
		default: false
	},
	// This saves on comment's ObjectId, ref refers to the Comment model
	comments: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;