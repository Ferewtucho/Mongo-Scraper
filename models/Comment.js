// requrie mongoose
var mongoose = require('mongoose');
// Create the Schema class
var Schema = mongoose.Schema;

// create the Comment schema
var CommentSchema = new Schema({
  body: {
    type: String
  }
});

// Mongoose will automaticaly save the ObjectIds of the Comments
// These ids are refered to the Article model

// Create the Comment model with the CommentSchema
var Comment = mongoose.model('Comment', CommentSchema);

// Export the Note model
module.exports = Comment;