var path = require("path");

module.exports = function(app) {

    app.get("/userview:user", function(req, res) {
        res.sendFile(path.join(__dirname, "/../public/reviews.html"));
    });

    app.get("/usersearch:user", function(req, res) {
        res.sendFile(path.join(__dirname, "/../public/index.html"));
    });

    app.use(function(req, res) {
        res.sendFile(path.join(__dirname + "/../public/index.html"));
    });
    
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname + "/../public/index.html"));
    });
};