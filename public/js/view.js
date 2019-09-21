$(document).ready(function() {
///
//begin script for oauth

console.log(profile.getName() + "yaaasss");



   
///

var $newArtist;
var $newSong;
var $newAuthor;
var $newReview = $("textarea.review-input");

$("#makeReview").css("visibility", "hidden");

$newAuthor = window.location.href.toLowerCase();
var userNum = $newAuthor.indexOf("usersearch");
if (userNum != -1) {
    $newAuthor = window.location.href.slice(userNum + 10);
    $newAuthor = $newAuthor.replace("%20", " ");
    $("input.signIn").val($newAuthor);
    loggingUser();
} else {
    $("#userName").css("visibility", "hidden");
    $("#searchSong").css("visibility", "hidden");
    $(".logout-div").css("visibility", "hidden");
};

$(document).on("click", "button.login", loggingUser);
$(document).on("click", "a.logout", logOut);
$(document).on("click", "a.review-page", returnIndex);

function returnIndex() {
    location.href = "userview" + $newAuthor;
};

function logOut() {
    $newAuthor = "";
    loggingUser();
};

function loggingUser() {
    if ($("input.signIn").val() != "") {
        $("#login-form").css("visibility", "hidden");
        $("#userName").css("visibility", "visible");
        $newAuthor = $("input.signIn").val();
        $("#userName").text("Welcome " + $newAuthor + "!");
        $("button.login").css("visibility", "hidden");
        $(".logout-div").css("visibility", "visible");
        $("#song-results").empty();
        $("#searchSong").css("visibility", "visible");
    } else {
        $("#userName").css("visibility", "hidden");
        $("#login-form").css("visibility", "visible");
        $("button.login").css("visibility", "visible");
        $(".logout-div").css("visibility", "hidden");
        $("#makeReview").css("visibility", "hidden");
        $("#searchSong").css("visibility", "hidden");
    }
    $("input.signIn").val("");
};


$(document).on("click", ".btnn", buttonMagic);
$(document).on("keyup", "#magic-button", checkButtonMagic);

function buttonMagic() {
    $(".input").toggleClass("active").focus;
    $(".btnn").toggleClass("animate");
    var songInput = $(".input").val();
    if (songInput != "") {
        //console.log(songInput);
        $newSong = songInput;
        spotifySearch();
    }
    $(".input").val("");
};

function checkButtonMagic(e) {
    if(e && e.keyCode == 13) {
        $("#magic-button").blur();
        buttonMagic();
    }
};

function spotifySearch() {
    var songSearch = {
        song: $newSong
    };
    $.post("/api/Spotify", songSearch, function(data) {
        showSongs(data);
        //console.log(data);
    });
};

function showSongs(data) {
    $("#song-results").empty();
    var songRows = $("<div class='form-check'>" + "<input class='form-check-input' type='radio' name='song' id='" + data[0].artist + "' value='" + data[0].song + "' checked>" +
    "<img src='" + data[0].albumURL + "' height='100' width='100'/>" +
    "Artist(s): " + data[0].artist + "<br>" +
    "Song: " + data[0].song + "</label>" + "<div>" + 
    "<audio controls>" + "<source src='" + data[0].previewURL + "' type='audio/ogg'>" + "Your browser does not support the audio element." + "</audio>" + "<br>");
    $("#song-results").append(songRows);
    $("#song-results").append("<br>" + "<br>");

    for (var i = 1; i < data.length; i++) {
        var songRows = $("<div class='form-check'>" + "<input class='form-check-input' type='radio' name='song' id='" + data[i].artist + "' value='" + data[i].song + "'>" +
        "<img src='" + data[i].albumURL + "' height='100' width='100'/>" +
        "Artist(s): " + data[i].artist + "<br>" +
        "Song: " + data[i].song + "</label>" + "<div>" + 
        "<audio controls>" + "<source src='" + data[i].previewURL + "' type='audio/ogg'>" + "Your browser does not support the audio element." + "</audio>" + "<br>");
        $("#song-results").append(songRows);
        $("#song-results").append("<br>" + "<br>");
    };

    $("#makeReview").css("visibility", "visible");
    getReviews();
};

var $reviewContainer = $(".review-container");

$(document).on("click", "button.delete", deleteReview);
$(document).on("click", ".review-item", editReview);
$(document).on("keyup", ".review-item", finishEdit);
$(document).on("blur", ".review-item", cancelEdit);
$(document).on("submit", "#review-form", insertReview);

var reviews = [];

function initializeRows() {
    $reviewContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < reviews.length; i++) {
        rowsToAdd.splice(0, 0, createNewRow(reviews[i]));
    }
    $reviewContainer.prepend(rowsToAdd);
};

function getReviews() {
    $.get("/api/reviews", function(data) {
        reviews = data;
        initializeRows();
    });
};

function deleteReview(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/api/reviews/" + id
    }).then(getReviews);
}

function editReview() {
    var currentReview = $(this).data("review");
    $(this).children("input.edit").val(currentReview.review);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
};

function finishEdit(event) {
    var updatedReview = $(this).data("review");
    if (event.which === 13) {
        updatedReview.review = $(this).children("input").val().trim();
        $(this).blur();
        updateReview(updatedReview);
    };
};

function updateReview(review) {
    $.ajax({
        method: "PUT",
        url: "/api/reviews",
        data: review
    }).then(getReviews);
};

function cancelEdit() {
    var currentReview = $(this).data("review");
    if (currentReview) {
        $(this).children("input.edit").hide();
        $(this).children("input.edit").val(currentReview.review);
        //$(this).children("span").show();
        //$(this).children("button").show();
    }
}

function createNewRow(review) {

    if ($newAuthor === review.author) {
        var $newInputRow = $(
            "<li class='list-group-item review-item'>" + "<p>" + "User: " + review.author + "</p>" +
            "<p>" + "Artist(s): " + review.artist + "</p>" + 
            "<p>" + "Song: " + review.song + "</p>" + 
            "<p>" + "Review: " + review.review + "</p>" + 
            "<input type='text' class='edit' style='display: none;'>" +
            "<button class='delete btn btn-danger'>x</button>" + 
            "</li>" + "<br>" + "<br>"
        );
    
        $newInputRow.find("button.delete").data("id", review.id);
        $newInputRow.find("input.edit").css("display", "none");
        $newInputRow.data("review", review);
    } else {
        var $newInputRow = $(
            "<li class='list-group-item review-item'>" + "<p>" + "User: " + review.author + "</p>" +
            "<p>" + "Artist(s): " + review.artist + "</p>" + 
            "<p>" + "Song: " + review.song + "</p>" + 
            "<p>" + "Review: " + review.review + "</p>" + 
            //"<input type='text' class='edit' style='display: none;'>" +
            //"<button class='delete btn btn-danger'>x</button>" + 
            "</li>" + "<br>" + "<br>"
        );
    
        //$newInputRow.find("button.delete").data("id", review.id);
        //$newInputRow.find("input.edit").css("display", "none");
        $newInputRow.data("review", review);
    };
    
    return $newInputRow;
};

function insertReview(event) {
    event.preventDefault();
    //id = artist, value = song
    $newArtist = document.querySelector("input[name='song']:checked").id;
    $newSong = document.querySelector("input[name='song']:checked").value;

    var review = {
        artist: $newArtist.trim(),
        song: $newSong.trim(),
        author: $newAuthor,
        review: $newReview.val().trim()
    };

    $.post("/api/reviews", review, getReviews);
    $newReview.val("");
};


});