$(document).ready(function() {

var $newArtist;
var $newSong;
var $newAuthor;
var $newReview = $("textarea.review-input");

$newAuthor = window.location.href.toLowerCase();
var userNum = $newAuthor.indexOf("userview");
if (userNum != -1) {
    $newAuthor = window.location.href.slice(userNum + 8);
    $newAuthor = $newAuthor.replace("%20", " ");
    $("input.signIn").val($newAuthor);
    loggingUser();
} else {
    $("#userName").css("visibility", "hidden");
    $("#searchSong").css("visibility", "hidden");
    $(".logout-div").css("visibility", "hidden");
    $("#makeReview").css("visibility", "hidden");
};

$(document).on("click", "button.login", loggingUser);
$(document).on("click", "a.logout", logOut);
$(document).on("click", "a.index-page", returnIndex);

function returnIndex() {
    location.href = "usersearch" + $newAuthor;
};

function logOut() {
    $newAuthor = "";
    $(".review-container").empty();
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
        $(".review-container").empty();
        $("#searchSong").css("visibility", "visible");
        $("#makeReview").css("visibility", "visible");
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
    var reviewInput = $(".input").val();
    if (reviewInput != "") {
        //console.log(reviewInput);
        var choice = $("option:selected").text();
        $("select").prop("selectedIndex", 0);

        if (choice === "Artist Search") {
            checkArtist(reviewInput);
        } else if (choice === "Song Search") {
            checkSong(reviewInput);
        } else if (choice === "User Search") {
            checkUser(reviewInput);
        } else {
            checkItAll(reviewInput);
        }
    }
    $(".input").val("");
};

function checkButtonMagic(e) {
    if(e && e.keyCode == 13) {
        $("#magic-button").blur();
        buttonMagic();
    };
};

var $reviewContainer = $(".review-container");

$(document).on("click", "button.delete", deleteReview);
$(document).on("click", ".review-item", editReview);
$(document).on("keyup", ".review-item", finishEdit);
$(document).on("blur", ".review-item", cancelEdit);

$(document).on("click", "button.my-reviews", getMyReviews);
$(document).on("click", "button.all-reviews", getReviews);

var reviews = [];

function initializeRows() {
    $reviewContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < reviews.length; i++) {
        rowsToAdd.splice(0, 0, createNewRow(reviews[i]));
    }
    $reviewContainer.prepend(rowsToAdd);
};

var onlyMyReview = false;

function checkArtist(input) {
    onlyMyReview = false;
    $.get("/api/artist/" + input, function(data) {
        reviews = data;
        initializeRows();
    });
};

function checkSong(input) {
    onlyMyReview = false;
    $.get("/api/song/" + input, function(data) {
        reviews = data;
        initializeRows();
    });
};

function checkUser(input) {
    onlyMyReview = false;
    $.get("/api/author/" + input, function(data) {
        reviews = data;
        initializeRows();
    });
};

function checkItAll(input) {
    onlyMyReview = false;
    $.get("/api/all/" + input, function(data) {
        reviews = data;
        initializeRows();
    });
};

function getReviews() {
    onlyMyReview = false;
    $.get("/api/reviews", function(data) {
        reviews = data;
        initializeRows();
    });
};

function getMyReviews() {
    onlyMyReview = true;
    $.get("/api/reviews/" + $newAuthor, function(data) {
        reviews = data;
        initializeRows();
    }) 
};

function deleteReview(event) {
    event.stopPropagation();
    var id = $(this).data("id");

    if (onlyMyReview) {
        $.ajax({
            method: "DELETE",
            url: "/api/reviews/" + id
        }).then(getMyReviews);
    } else {
        $.ajax({
            method: "DELETE",
            url: "/api/reviews/" + id
        }).then(getReviews);
    };
};

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
    if (onlyMyReview) {
        $.ajax({
            method: "PUT",
            url: "/api/reviews",
            data: review
        }).then(getMyReviews);
    } else {
        $.ajax({
            method: "PUT",
            url: "/api/reviews",
            data: review
        }).then(getReviews);
    }
};

function cancelEdit() {
    var currentReview = $(this).data("review");
    if (currentReview) {
        $(this).children("input.edit").hide();
        $(this).children("input.edit").val(currentReview.review);
    };
};

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

});