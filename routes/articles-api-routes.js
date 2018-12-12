// Require models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");

module.exports = function(app) {

	app.get("/", function(req, res) {
		return res.redirect("/home");
	});

	// A GET request to scrape Science Daily health news
	app.get("/scrape", function(req,res){
		// First we grab the body of the html with request
		request("http://www.theverge.com/tech", function (error, response, html) {
			// Then we loan that into cheerio and save it to $ for a shorthand selector
			var $ = cheerio.load(html);
			// now we grab every h2 within an article tag, and do the following:
			$("h2.c-entry-box--compact__title").each(function(i, element) {
				// save an empty result object
				var result = {};
				// add the text and href of every link, and save them as properties of the result object
				result.title = $(this).children("a").text();
				result.link = $(this).children("a").attr("href");

				// Using oure article model, crate a new entry
				// this effectively passes the result object to the entry (and the title and link)
				var entry = new Article(result);
				// Now insert that entry to the db
				entry.save(function(err, doc) {
					// log any errors
					if (err) {
						console.log(err);
					}
					else {
						console.log(doc);
					}
				});
			});
		});
		return res.send({redirect: "/home"});
	});

	// Find all the articles previously sraped
	app.get("/home", function(req, res) {
		Article.find({saved: false}, function (err, doc) {
			if (err) {
				return res.send(err);
			}
			else {
				var hbsObject = {
					articles: doc
				};
				// console.log(hbsObject);
				res.render("index", hbsObject);
			}
		});
	});

	// Find all the articles that have been saved
	app.get("/savedArticles", function(req, res) {
		Article.find({saved: true}, function (err, doc) {
			if (err) {
				return res.send(err);
			}
			else {
				var hbsObject = {
					articles: doc
				};
				// console.log(hbsObject);
				res.render("saved", hbsObject);
			}
		});
	});

	//route to save articles
	app.put("/save", function(req, res) {
		// save article id
		console.log(req.body.id)
		var articleId = req.body.id;

		Article.update({
			"_id": articleId
		}, {
		$set: {
			"saved": true
		}}, function (error, doc) {
			if(error) {
				console.log(error);
			}
			else {
				console.log(doc);
			}
		});
		return res.send({redirect: "/home"});
	});

	// route to delete saved articles
	app.put("/deleteFromSaved", function(req, res) {
		// save article id
		var articleId = req.body.id;

		Article.update({
			"_id": articleId
		}, {
		$set: {
			"saved": false
		}}, function (error, doc) {
			if(error) {
				console.log(error);
			}
			else {
				console.log(doc);
			}
		});
		return res.send({redirect: "/savedArticles"});
	});

	// This will grab an article by it's ObjectId
	app.get("/articles/:id", function(req, res) {
		Article.findOne({_id: req.params.id})
		.populate("comments")
		.exec(function (error, doc) {
			if (error) {
				console.log(error);
			}
			else {
				res.json(doc);
			}
		});
	});

	// Create a new Note and populate the Article's notes
	app.post("/articles/:id", function(req, res) {
		var newComment = new Comment(req.body);
		newComment.save(function(error, doc) {
			if (error) {
				console.log (error);
			}
			else {
				Article.findOneAndUpdate({"_id": req.params.id}, { $push: {"comments": doc._id} }, {new: true})

				.exec(function(err, newDoc){
					if (err) {
						console.log(err);
					}
					else {
						console.log(newDoc);
					}
				});
			}
		});
	});

};