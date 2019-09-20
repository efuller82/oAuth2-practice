var db = require("../models");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

require("dotenv").config();
var SpotifyAPI = require("./SpotifyAPI");
var keys = require("../keys.js");
var spotify = new SpotifyAPI(keys.spotify);

module.exports = function (app) {


    app.post("/api/Spotify", function (req, res) {
        spotify.getSong(req.body.song, (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            res.json(data);
        });
    });

    app.get("/api/reviews", function (req, res) {
        db.Review.findAll({}).then(function (dbReview) {
            res.json(dbReview);
        });
    });

    app.get("/api/reviews/:author", function(req, res) {
        db.Review.findAll({
            where: {
                author: req.params.author
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        });
    });

    app.get("/api/artist/:artist", function(req, res) {
        db.Review.findAll({
            where: {
                artist: {
                    [Op.like]: "%" + req.params.artist + "%"
                }
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        });
    });

    app.get("/api/song/:song", function(req, res) {
        db.Review.findAll({
            where: {
                song: {
                    [Op.like]: "%" + req.params.song + "%"
                }
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        });
    });

    app.get("/api/author/:author", function(req, res) {
        db.Review.findAll({
            where: {
                author: {
                    [Op.like]: "%" + req.params.author + "%"
                }
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        });
    });

    app.get("/api/all/:all", function(req, res) {
        db.Review.findAll({
            where: {
                [Op.or]: [
                    {
                        artist: {
                            [Op.like]: "%" + req.params.all + "%"
                        }
                    }, {
                        song: {
                            [Op.like]: "%" + req.params.all + "%"
                        }
                    }, {
                        author: {
                            [Op.like]: "%" + req.params.all + "%"
                        }
                    }
                ]
            }
        }).then(function(dbReview) {
            res.json(dbReview);
        });
    });


    app.post("/api/reviews", function (req, res) {
        db.Review.create({
            artist: req.body.artist,
            song: req.body.song,
            author: req.body.author,
            review: req.body.review
        }).then(function (dbReview) {
            res.json(dbReview);
        }).catch(function (err) {
            res.json(err);
        });
    });

    app.delete("/api/reviews/:id", function (req, res) {
        db.Review.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbReview) {
            res.json(dbReview);
        });
    });

    app.put("/api/reviews", function (req, res) {
        db.Review.update({
            artist: req.body.artist,
            song: req.body.song,
            author: req.body.author,
            review: req.body.review
        }, {
            where: {
                id: req.body.id
            }
        }).then(function (dbReview) {
            res.json(dbReview);
        }).catch(function (err) {
            res.json(err);
        });
    });

};