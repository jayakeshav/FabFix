function hideLogin(){
    jQuery("#parent").hide();
    jQuery("#main").hide();
}
function hideLoginPage() {
    jQuery(".loginPage").hide();
}
function hideMovies(){
    jQuery(".moviesPage").hide();
}
function hideMovie(){
    jQuery(".moviePage").hide();
}
function hideCart(){
    jQuery(".cartPage").hide();
}
function hideBestMovies(){
    jQuery(".bestMovies").hide();
}
function hideTransactions(){
    jQuery(".transactionPage").hide();
}
$(document).ready(function () {
    $("#loginNav").click(function () {
        hideLogin();
        $("#parent").slideToggle("slow");
        hideBestMovies();
        hideMovies();
        hideCart();
        window.location.href="#parent"
    });
});
$(document).ready(function () {
    $("#registerNav").click(function () {
        hideLogin();
        $("#main").slideToggle("slow");
    });
});

function loadMoviesPage() {
    hideBestMovies();
    hideLoginPage();
    hideMovie();
    hideCart();
    $(".moviesPage").show();
}
function loadCartPage() {
    hideBestMovies();
    hideLoginPage();
    hideMovie();
    hideMovies();
    hideTransactions();
    $(".cartPage").show();
    loadCart();
}
function loadLoginPage() {
    hideBestMovies();
    hideLoginPage();
    hideMovie();
    hideMovies();
    hideCart();
    hideTransactions();
    $(".loginPage").show();
}
function loadMoviePage() {
    hideBestMovies();
    hideLoginPage();
    hideMovies();
    hideCart();
    hideTransactions();
    $(".moviePage").show();
}

function reloadCart() {
    document.location.reload();
    loadCartPage();
}

function showTransactions() {
    hideBestMovies();
    hideLoginPage();
    hideMovies();
    hideCart();
    hideMovie();
    jQuery(".transactionPage").show();

}