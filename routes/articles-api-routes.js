// Require models
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var path = require("path");


// Requiring Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

module.exports = function (app) {

	//GET requests to render Handlebars pages
	app.get("/", function (req, res) {
		Article.find({ "saved": false }, function (error, data) {
			var hbsObject = {
				article: data
			};
			console.log(hbsObject);
			res.render("home", hbsObject);
		});
	});

	// Find all the articles that have been saved
	app.get("/saved", function (req, res) {
		Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
			var hbsObject = {
				article: articles
			};
			res.render("saved", hbsObject);
		});
	});
	// A GET request to scrape Science Daily health news
	app.get("/scrape", function (req, res) {
		// First we grab the body of the html with request
		request("http://www.theverge.com/tech", function (error, response, html) {
			// Then we loan that into cheerio and save it to $ for a shorthand selector
			var $ = cheerio.load(html);
			// now we grab every h2 within an article tag, and do the following:
			$("h2.c-entry-box--compact__title").each(function (i, element) {
				// save an empty result object
				var result = {};
				// add the text and href of every link, and save them as properties of the result object
				result.title = $(this).children("a").text();
				result.link = $(this).children("a").attr("href");

				// Using oure article model, crate a new entry
				// this effectively passes the result object to the entry (and the title and link)
				var entry = new Article(result);
				// Now insert that entry to the db
				entry.save(function (err, doc) {
					// log any errors
					if (err) {
						console.log(err);
					}
					else {
						console.log(doc);
					}
				});
			});
			res.send("Scrape Complete");
		});
		// return res.send({ redirect: "/home" });
	});

	// Find all the articles previously sraped
	app.get("/articles", function (req, res) {
		// Grab every doc in the Articles array
		Article.find({}, function (error, doc) {
			// Log any errors
			if (error) {
				console.log(error);
			}
			// Or send the doc to the browser as a json object
			else {
				res.json(doc);
			}
		});
	});

	// This will grab an article by it's ObjectId
	app.get("/articles/:id", function (req, res) {
		// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
		Article.findOne({ "_id": req.params.id })
			// ..and populate all of the notes associated with it
			.populate("note")
			// now, execute our query
			.exec(function (error, doc) {
				// Log any errors
				if (error) {
					console.log(error);
				}
				// Otherwise, send the doc to the browser as a json object
				else {
					res.json(doc);
				}
			});
	});


	//route to save articles
	app.post("/articles/save/:id", function (req, res) {
		// save article id
		// Use the article id to find and update its saved boolean
		Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
			// Execute the above query
			.exec(function (err, doc) {
				// Log any errors
				if (err) {
					console.log(err);
				}
				else {
					// Or send the document to the browser
					res.send(doc);
				}
			});

	});

	// route to delete saved articles
	app.post("/articles/delete/:id", function (req, res) {
		// save article id
		// Use the article id to find and update its saved boolean
		Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
			// Execute the above query
			.exec(function (err, doc) {
				// Log any errors
				if (err) {
					console.log(err);
				}
				else {
					// Or send the document to the browser
					res.send(doc);
				}
			});
	});



	// Create a new Note and populate the Article's notes
	app.post("/notes/save/:id", function (req, res) {
		// Create a new note and pass the req.body to the entry
		var newNote = new Note({
			body: req.body.text,
			article: req.params.id
		});
		console.log(req.body)
		// And save the new note the db
		newNote.save(function (error, note) {
			// Log any errors
			if (error) {
				console.log(error);
			}
			// Otherwise
			else {
				// Use the article id to find and update it's notes
				Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
					// Execute the above query
					.exec(function (err) {
						// Log any errors
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							// Or send the note to the browser
							res.send(note);
						}
					});
			}
		});
	});

	// Delete a note
	app.delete("/notes/delete/:note_id/:article_id", function (req, res) {
		// Use the note id to find and delete it
		Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
			// Log any errors
			if (err) {
				console.log(err);
				res.send(err);
			}
			else {
				Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
					// Execute the above query
					.exec(function (err) {
						// Log any errors
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							// Or send the note to the browser
							res.send("Note Deleted");
						}
					});
			}
		});
	});

}