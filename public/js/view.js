$(document).ready(function () {

    testing();

    function testing() {
        $.post("/api/Spotify", "love", function (data) {
            console.log(data);
        });
    };

    var $newArtist = $("input.song-input");
    var $newSong = $("input.artist-input");
    var $newAuthor = $("input.author-input");
    var $newReview = $("input.review-input");

    var $reviewContainer = $(".review-container");

    $(document).on("click", "button.delete", deleteReview);
    $(document).on("click", ".review-item", editReview);
    $(document).on("keyup", ".review-item", finishEdit);
    $(document).on("blur", ".review-item", cancelEdit);
    $(document).on("submit", "#review-form", insertReview);

    var reviews = [];

    getReviews();

    function initializeRows() {
        $reviewContainer.empty();
        var rowsToAdd = [];
        for (var i = 0; i < reviews.length; i++) {
            rowsToAdd.push(createNewRow(reviews[i]));
        }
        $reviewContainer.prepend(rowsToAdd);
    };

    function getReviews() {
        $.get("/api/reviews", function (data) {
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
        //$(this).children().hide();
        $(this).children("input.edit").val(currentReview.text);
        $(this).children("input.edit").show();
        $(this).children("input.edit").focus();
    };

    function finishEdit(event) {
        var updatedReview = $(this).data("review");
        if (event.which === 13) {
            updatedReview.text = $(this).children("input").val().trim();
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
            //$(this).children().hide();
            $(this).children("input.edit").val(currentReview.text);
            $(this).children("span").show();
            $(this).children("button").show();
        }
    }

    function createNewRow(review) {
        var $newInputRow = $(
            [
                "<li class='list-group-item review-item'>",
                "<span>",
                review.artist,
                "</span>",
                "<span>",
                review.song,
                "</span>",
                "<span>",
                review.author,
                "</span>",
                "<br>",
                "<span>",
                review.review,
                "</span>",
                "<input type='text' class='edit' style='display: none;'>",
                "<button class='delete btn btn-danger'>x</button>",
                "</li>",
                "<br>"
            ].join("\n")
        );

        $newInputRow.find("button.delete").data("id", review.id);
        $newInputRow.find("input.edit").css("display", "none");
        $newInputRow.data("review", review);
        return $newInputRow;
    };


    function insertReview(event) {
        event.preventDefault();
        var review = {
            artist: $newArtist.val().trim(),
            song: $newSong.val().trim(),
            author: $newAuthor.val().trim(),
            review: $newReview.val().trim()
        };

        $.post("/api/reviews", review, getReviews);
        $newArtist.val("");
        $newSong.val("");
        $newAuthor.val("");
        $newReview.val("");
    };


});