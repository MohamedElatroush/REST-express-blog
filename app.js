const express =  require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

const uri = "mongodb://localhost:27017/wikiDB"
mongoose.set('strictQuery', true);
mongoose.connect(uri, {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
    .get(function(req, res){
        Article.find({}, function(err, articles){
            if(!err){
                res.send(articles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err){
            res.send("Success");
            } else {
                res.send("A problem has occurred :(")
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
        if(!err){
            res.send('Successfully deleted all articles');
        } else{
            res.send('OPS, couldnt delete all articles');
        }
        });
    });

app.route('/articles/:articleTitle')
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found!");
            }
        });
    })
    .put(function(req, res){
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                } else {
                    res.send("Error has occurred.");
                }
            }
        )
    })
    .patch(function(req, res){
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if(!err){
                res.send(`Successfully deleted article with title ${req.params.articleTitle}`)
            } else {
                res.send(err);
            }
        });
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

