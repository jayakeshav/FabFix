$(document).ready(function () {
    $("#moviesNav").click(function () {
        hideAll();
        $("#movies").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#starsNav").click(function () {
        hideAll();
        $("#stars").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#genresNav").click(function () {
        hideAll();
        $("#genres").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#customersNav").click(function () {
        hideAll();
        $("#customers").slideToggle("slow");
    });
});

function hideAll() {
    jQuery(".movies").hide();
    jQuery(".stars").hide();
    jQuery(".genres").hide();
    jQuery(".customers").hide();
}
function hideMovies(){
    jQuery(".addMovies").hide();
    jQuery(".deleteMovies").hide();
}
function hideStars(){
    jQuery(".starSearch").hide();
    jQuery(".addStar").hide();
    jQuery(".addStarToMovie").hide();
}
function hideCustomer(){
    jQuery(".addCustomer").hide();
    jQuery(".updateCustomer").hide();
    jQuery(".viewCustomer").hide();
}

$(document).ready(function () {
    $("#addMoviesNav").click(function () {
        hideMovies();
        $("#addMovies").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#deleteMoviesNav").click(function () {
        hideMovies();
        $("#deleteMovies").slideToggle("slow");
    });
});

$(document).ready(function () {
    $("#starSearchNav").click(function () {
        hideStars();
        $("#starSearch").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#addStarNav").click(function () {
        hideStars();
        $("#addStar").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#addStarToMovieNav").click(function () {
        hideStars();
        $("#addStarToMovie").slideToggle("slow");
    });
});

$(document).ready(function () {
    $("#addCustomerNav").click(function () {
        hideCustomer();
        $("#addCustomer").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#updateCustomerNav").click(function () {
        hideCustomer();
        $("#updateCustomer").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#viewCustomersNav").click(function () {
        hideCustomer();
        $("#viewCustomer").slideToggle("slow");
    });
});