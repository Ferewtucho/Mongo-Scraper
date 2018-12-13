// Scrape articles with SCRAPE NEW ARTICLES button
$("#scrapeNewArticles").on("click", function (event) {
  // Make ajax call for the /scrape route
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .done(function (data) {
      console.log("scraped");
      window.location = "/";
    });
});

// Save article and send data to the /save route
$(".saveArticleButton").on("click", function (event) {
  event.preventDefault();
  console.log("Clicked");

  var thisId = $(this).attr("data");

  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  })
    .done(function (data) {
      console.log(data);
      window.location = "/";
      // window.location.href = data.redirect;
    });
});

// Delete article from saved and send data to the /deleteFromSaved route
$(".deleteFromSaved").on("click", function (event) {
  event.preventDefault();

  var thisId = $(this).attr("data");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
      window.location = "/saved";
      // window.location.href = data.redirect;
    });
});

//Handle Save Note button
$(".saveNote").on("click", function () {
  var thisId = $(this).attr("data-id");
  if (!$("#noteText" + thisId).val()) {
    alert("please enter a note to save")
  } else {
    $.ajax({
      method: "POST",
      url: "/notes/save/" + thisId,
      data: {
        text: $("#noteText" + thisId).val()
      }
    }).done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#noteText" + thisId).val("");
      $(".modalNote").modal("hide");
      window.location = "/saved"
    });
  }
});

//Handle Delete Note button
$(".deleteNote").on("click", function () {
  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/delete/" + noteId + "/" + articleId
  }).done(function (data) {
    console.log(data)
    $(".modalNote").modal("hide");
    window.location = "/saved"
  })
});

// $(".closeScrapeModal").on("click", function (event) {
//   event.preventDefault();
//   location.href = "/";
// });

// $(".closeCommentModal").on("click", function (event) {
//   event.preventDefault();
//   location.href = "/saved";
// });

// $(".modal").on("hidden.bs.modal", function (event) {
//   event.preventDefault();
//   $(".modal-body1").html("");
// });