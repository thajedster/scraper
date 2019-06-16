var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//routes

axios.get('https://www.apnews.com/').then((response) => {
    var $ = cheerio.load(response.data);

    $("[data-key=related-story]").each(function (i, element) {
        // console.log(element)
        result = {}
        result.title = $(element).children("[data-key=related-story-link]").children("[data-key=related-story-headline]").text();
        result.link = $(element).children("[data-key=related-story-link]").attr("href");
        // console.log(result)
        db.Article.create(result).then(function (dbArticle) {
            console.log(dbArticle);
        }).catch(function (err) {
            console.log(err);
        });
    });
});



app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


//server start
app.listen(PORT, function () {
    console.log(`listening on PORT: ${PORT}`);
});