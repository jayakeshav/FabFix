function getParam(target) {
    var urlParams = new URLSearchParams (window.location.search);
    if (urlParams.has(target)){
        return urlParams.get(target);
    }
    else
        return null;
}
var id;
// var url = getHost()+"/movies/get/"+id;
var emailMovie = getEmail();
var sessionID = getSessionID();
var k=0;
// $.ajax({
//     method:"GET",
//     url:url,
//     headers:{
//         "email":emailMovie,
//         "sessionID":sessionID,
//     },
//     success:handleRedirect
// });
function getMovieByID( movieId){
    id = movieId;
    var url = getHost()+"/movies/get/"+id;
    console.log(url);
    emailMovie = getEmail();
    sessionID = getSessionID();
    k=0;
    $.ajax({
        method:"GET",
        url:url,
        headers:{
            "email":emailMovie,
            "sessionID":sessionID,
        },
        success:handleRedirectMovie
    });
}

function handleRedirectMovie(res,textStatus,xhr) {
    // debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:emailMovie,
            transactionID:transactionID
        },
        success:handlex
    });
}
function handlex(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (k==20){
            k=0;
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectMovie(res,textstatus,xhr);
    }
    else {
        handleResultMovie(res);
    }
}
function handleResultMovie(res){
    var movie = res.movie;
    hideLoginPage();
    hideBestMovies();
    hideCart();
    hideMovies();
    jQuery(".moviePage").show();
    var movieName = jQuery("#movieTitle");
    movieName.append("Title:"+movie["title"]);
    var movieDetails = jQuery("#movieDetails");
    jQuery(".movieDetails").empty();
    var genres = movie["genres"];
    var stars = movie["stars"];

    var genresString = "";
    for (var i=0; i<genres.length; i++){
        genresString+=
            '<a href="#">' + genres[i]["name"]+'</a>' + ',';
    }
    var starString = "";
    for (var i=0; i<stars.length; i++){
        starString+=
            '<a href="#">' + stars[i]["name"]+'</a>' + ',';
    }
    var details = "";
    details+="<h5>"+"Director:</h5><p>"+movie["director"]+"</p><br>";
    details+="<h5>"+"Year released:</h5><p>"+movie["year"]+"</p><br>";
    details+="<h5>"+"Ratings:</h5><p>"+movie["rating"]+"("+movie["numVotes"]+")</p><br>";
    var overview = movie["overview"];
    if (overview!=null) {
        details += "<h5>" + "Plot:</h5><p>" + movie["overview"] + "</p><br>";
    }
    details+="<h5>"+"Stars:</h5><p>"+starString+"</p><br>";
    details+="<h5>"+"Genres:</h5><p>"+genresString+"</p><br>";
    movieDetails.append(details);
}



$(".placeMovie").submit(function (event) {
   event.preventDefault();
   console.log("hit");
   var quantity = $(".quantity").val();
   console.log(quantity);
   if (quantity==0) {
       window.alert("enter quantity");
       return;
   }
   var object = '{' +
       '   "email": "'+emailMovie+'",' +
       '   "movieId": "'+id+'",' +
       '   "quantity": '+quantity+'}';
    var url1 = getHost()+"/billing/cart/insert";
    sessionID=getSessionID();
    // debugger;
    $.ajax({
        method:"POST",
        url: url1,
        contentType: "application/json",
        dataType: "json",
        data: object,
        headers : {
            "email":emailMovie,
            "sessionID":sessionID,
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"*",
            "Access-Control-Expose-Headers":"*"
        },
        success:handleRedirect1
    });
});

function handleRedirect1(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:emailMovie,
            transactionID:transactionID
        },
        success:handle1
    });
}

function handle1(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (k==20){
            k=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirect1(res,textstatus,xhr);
    }
    else {
        handlecart(res);
    }
}

function handlecart(res) {
    var resultCode = res["resultCode"];
    var message = res["message"];
    if (resultCode==311){
        window.alert("movie already available in cart");
        loadCartPage()
    }
    else if(resultCode==3100){
        window.alert("movieAdded");
        wait(500);
        loadCartPage();
    }
    else {
        window.alert("failed to add to cart.. retry")
    }
}
