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
    });
});

// Save article and send data to the /save route
$(".saveArticleButton").on("click", function (event) {
  event.preventDefault();
  console.log("Clicked");

  $.ajax({
    method: "PUT",
    url: "/save",
    data: {
      id: $(this).attr("data")
    }
  })
    .done(function (data) {
      console.log(data);
      window.location.href = data.redirect;
    });
});

// Delete article from saved and send data to the /deleteFromSaved route
$(".deleteFromSaved").on("click", function (event) {
  event.preventDefault();

  $.ajax({
    method: "PUT",
    url: "/deleteFromSaved",
    data: {
      id: $(this).attr("data")
    }
  })
    .done(function (data) {
      console.log(data);
      window.location.href = data.redirect;
    });
});

$(".commentSubmit").on("click", function (event) {
  event.preventDefault();

  var articleId = $(".articleId").val();
  console.log(articleId);
  console.log($(".commentBody").val());

  $.ajax({
    method: "POST",
    url: "/articles/" + articleId,
    data: {
      body: $(".commentBody").val()
    }
  })
    .done(function (data) {
      $(".commentBody").empty();
      console.log(data);
      window.location.href = data.redirect;
    });
});

$(".closeScrapeModal").on("click", function (event) {
  event.preventDefault();
  location.href = "/home";
});

$(".closeCommentModal").on("click", function (event) {
  event.preventDefault();
  location.href = "/savedArticles";
});

$(".modal").on("hidden.bs.modal", function (event) {
  event.preventDefault();
  $(".modal-body1").html("");
});