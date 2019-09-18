var db = require("../models");

var SpotifyAPI = require("./SpotifyAPI");

var configKey = {
    id: "5844d81617c04c9e99a4726e25a7d543",
    secret: "d3d0ec9f53024b1da340c446a312de0f",
};

var spotify = new SpotifyAPI(configKey);

module.exports = function(app) {

    app.post("/api/Spotify", function(req, res) {
        spotify.getSong("Dont Stop Believing", (error, data) => {
            if(error) {
                console.log(error);
                return;
            }
            console.log("it worked");
            //console.log(data);
            res.json(data);
        });
    });

    app.get("/api/reviews", function(req, res) {
        db.Review.findAll({}).then(function(dbReview) {
            res.json(dbReview);
        });
    });

    app.post("/api/reviews", function(req, res) {
        db.Review.create({
            artist: req.body.artist,
            song: req.body.song,
            author: req.body.author,
            review: req.body.review
        }).then(function(dbReview) {
            res.json(dbReview);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.delete("/api/reviews/:id", function(req, res) {
        db.Review.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        });
    });

    app.put("/api/reviews", function(req, res) {
        db.Review.update({
            artist: req.body.artist,
            song: req.body.song,
            author: req.body.author,
            review: req.body.review
        }, {
            where: {
                id: req.body.id
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        }).catch(function(err) {
            res.json(err);
        });
    });


};