var email;
var sessionID = getSessionID();
var pageNumber=0;

var basicSearchPage;
var advanceSearchPage;
var basicSearchNoEntries;
var advanceSearchNoEntries;

$(".basicSearchForm").submit(function (event) {
    event.preventDefault();
    checkLogin();
    console.log("hit basicSearchForm");

    var title = $(".title").val();
    var genre = $(".genre").val();
    var sortBy = $(".sortBy").val();
    var orderBy = $(".orderBy").val();
    var numMovies = $(".numMovies").val();
    var pageNum = $(".pageNum").val();

    var add=getHost()+"/movies/search?";
    if (numMovies!=0){
        add=add+"limit="+numMovies;
    }
    else {
        numMovies=10;
        add=add+"limit="+numMovies;
    }
    if (pageNum!=0&& pageNum!=1){
        add=add+"&offset="+(pageNum-1)*numMovies;
        pageNumber=pageNum;
    }
    else {
        add=add+"&offset=0";
        pageNumber=0;
    }
    if (title.length!=0){
        add=add+"&title="+title;
    }
    if (genre.length!=0){
        add=add+"&genre="+genre;
    }
    add=add+"&sortby="+sortBy;
    add=add+"&direction="+orderBy;

    basicSearchPage=1;

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectMovies,
        statusCode:{400:check400
        }
    });
});

function handleResult(res) {
    console.log(res);
    showSearchResults();
    //debugger;
    var movieDom = $('.browseResults');
    movieDom.empty(); // Clear the previous results

    // Manually build the HTML Table with the response
    var rowHTML = "<table border=\"1\" class='paginated'><tr><th>Title</th><th>Director</th><th>Year</th><th>Rating</th></tr><tbody>";
    var movieList = res.movies;

    if (movieList.length==0){
        var details = "<p>No Movies in this page, Search lower page number</p>"
        movieDom.append(details);
        return;
    }

    for (var i = 0; i < movieList.length; ++i) {
        rowHTML += "<tr>";
        var movieObject = movieList[i];
        var movieId = movieObject["movieId"];
        console.log(movieId);
        rowHTML += '<td><a onclick=getMovieByID("'+movieId+'")>'+ movieObject["title"] + '</a></td>';
        rowHTML += "<td>" + movieObject["director"] + "</td>";
        rowHTML += "<td>" + movieObject["year"] + "</td>";
        rowHTML += "<td>" + movieObject["rating"] + "</td>";
        rowHTML += "</tr>";
    }
    rowHTML += "</tbody></table><br>";
    rowHTML += "<button onclick='previousPage()' style='alignment: left'>previous</button>";
    rowHTML += "<button onclick='nextPage()' style='alignment: right'>next</button>";
    rowHTML += "<p>Page Number:"+basicSearchPage+"</p>";
    //debugger;
    movieDom.append(rowHTML);

    window.location.href = "#browseResults"
}
function previousPage() {
    if (basicSearchPage==1){
        return;
    }
    basicSearchPage--;
    var title = $(".title").val();
    var genre = $(".genre").val();
    var sortBy = $(".sortBy").val();
    var orderBy = $(".orderBy").val();
    var numMovies = $(".numMovies").val();
    var pageNum = basicSearchPage;

    var add=getHost()+"/movies/search?";
    if (numMovies!=0){
        add=add+"limit="+numMovies;
    }
    else {
        numMovies=10;
        add=add+"limit="+numMovies;
    }
    if (pageNum!=0&& pageNum!=1){
        add=add+"&offset="+(pageNum-1)*numMovies;
        pageNumber=pageNum;
    }
    else {
        add=add+"&offset=0";
        pageNumber=0;
    }
    if (title.length!=0){
        add=add+"&title="+title;
    }
    if (genre.length!=0){
        add=add+"&genre="+genre;
    }
    add=add+"&sortby="+sortBy;
    add=add+"&direction="+orderBy;

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectMovies,
        statusCode:{400:check400
        }
    });
}
function nextPage() {
    basicSearchPage++;
    var title = $(".title").val();
    var genre = $(".genre").val();
    var sortBy = $(".sortBy").val();
    var orderBy = $(".orderBy").val();
    var numMovies = $(".numMovies").val();
    var pageNum = basicSearchPage;

    var add=getHost()+"/movies/search?";
    if (numMovies!=0){
        add=add+"limit="+numMovies;
    }
    else {
        numMovies=10;
        add=add+"limit="+numMovies;
    }
    if (pageNum!=0&& pageNum!=1){
        add=add+"&offset="+(pageNum-1)*numMovies;
        pageNumber=pageNum;
    }
    else {
        add=add+"&offset=0";
        pageNumber=0;
    }
    if (title.length!=0){
        add=add+"&title="+title;
    }
    if (genre.length!=0){
        add=add+"&genre="+genre;
    }
    add=add+"&sortby="+sortBy;
    add=add+"&direction="+orderBy;

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectMovies,
        statusCode:{400:check400
        }
    });
}


function handleRedirectMovies(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession1();

        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");

    if (sessionID!=null) {
        setSessionID(sessionID);
    }
    // debugger;
    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleMovies
    });
}

function handleMovies(res,textstatus,xhr) {
    var i=0;
    console.log(xhr.status);
    if (xhr.status==204){
        wait(500);
        i++;
        if (i==20){
            window.alert("error loading");
            location.reload();
        }
        handleRedirectMovies(res,textstatus,xhr);
    }
    else {
        handleResult(res);
    }
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function checkCookie(){
    var temp = document.cookie;
    console.log(temp);
    hideSearchResults();
    addGenres();
}
function addGenres() {
    debugger;

    var add=getHost()+"/movies/genre";
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectG,
        statusCode:{400:check400
        }
    });


}
function handleRedirectG(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession1();

        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");

    if (sessionID!=null) {
        setSessionID(sessionID);
    }
    // debugger;
    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleG
    });
}

function handleG(res,textstatus,xhr) {
    var i=0;
    console.log(xhr.status);
    if (xhr.status==204){
        wait(500);
        i++;
        if (i==20){
            window.alert("error loading");
            location.reload();
        }
        handleRedirectG(res,textstatus,xhr);
    }
    else {
        handleResultG(res);
    }
}

function handleResultG(res) {
    console.log(res);
    var a = jQuery(".genre");
    var b = jQuery(".ggenre");
    var c = jQuery(".agenre");
    var v = "";
    var genres = res["genres"];
    for (var i = 0;i<genres.length;i++){
        var genre = genres[i]["name"];
        v += "<option value='"+genre+"'>"+genre+"</option>";
    }
    a.append(v);
    b.append(v);
    c.append(v);
}


function showSearchResults() {
    $(".searchResults").show();
}
function hideSearchResults() {
    $(".searchResults").hide();
}
function loadLoginPage() {
    hideMovie();
    hideMovies();
    hideCart();
    hideLogin();
    $("#loginPage").show();
}

function check400(res) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession1();
            console.log(document.cookie);
        }
    }
}

$(".quickSearchForm").submit(function (event) {
    event.preventDefault();
    checkLogin();
    console.log("hit quickSearchForm");

    var title = $(".titleQ").val();

    var add= getHost()+"/movies/search?";
    var numMovies=15;
    add=add+"limit="+numMovies;
    add=add+"&offset=0";
    pageNumber=0;
    add=add+"&title="+title;

    add=add+"&sortby=rating";
    add=add+"&direction=desc";

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectQ,
        statusCode:{400:check400
        }
    });
});

function handleRedirectQ(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession1();

        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");

    if (sessionID!=null) {
        setSessionID(sessionID);
    }
    // debugger;
    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleQ
    });
}

function handleQ(res,textstatus,xhr) {
    var i=0;
    console.log(xhr.status);
    if (xhr.status==204){
        wait(500);
        i++;
        if (i==20){
            window.alert("error loading");
            location.reload();
        }
        handleRedirectQ(res,textstatus,xhr);
    }
    else {
        handleResultQ(res);
    }
}

function handleResultQ(res) {
    console.log(res);
    //debugger;
    var movieDom = $('.quickSearchMovies');
    movieDom.empty(); // Clear the previous results

    var resultCode =res["resultCode"];
    if (resultCode==211){
        movieDom.append(res["message"]);
        return;
    }

    // Manually build the HTML Table with the response
    var rowHTML = "<table border=\"1\" class='paginated'><tr><th>Title</th><th>Director</th><th>Year</th><th>Rating</th></tr><tbody>";
    var movieList = res.movies;

    if (movieList.length==0){
        var details = "<p>No Movies in this page, Search lower page number</p>"
        movieDom.append(details);
        return;
    }

    for (var i = 0; i < movieList.length; ++i) {
        rowHTML += "<tr>";
        var movieObject = movieList[i];
        var movieId = movieObject["movieId"];
        rowHTML += '<td><a onclick=getMovieByID("'+movieId+'")>'+ movieObject["title"] + '</a></td>';
        rowHTML += "<td>" + movieObject["director"] + "</td>";
        rowHTML += "<td>" + movieObject["year"] + "</td>";
        rowHTML += "<td>" + movieObject["rating"] + "</td>";
        rowHTML += "</tr>";
    }
    rowHTML += "</tbody></table><br>";
    rowHTML += "<p>More Movies:<a href='#basicSearch'>clickHere</p>";

    //debugger;
    movieDom.append(rowHTML);

}
var advance = false;
var genreFn = false;
var letter = false;
function setFalse(){
    advance = false;
    genreFn = false;
    letter = false;
}

$(".advancedSearchForm").submit(function (event) {
    setFalse();
    advance = true;
    advanceSearchPage=1;
    event.preventDefault();
    checkLogin();
    console.log("hit basicSearchForm");

    var title = $(".atitle").val();
    var genre = $(".agenre").val();
    var year = $(".ayear").val();
    var direct = $(".direct").val();
    var sortBy = $(".asortBy").val();
    var orderBy = $(".aorderBy").val();
    var numMovies = $(".anumMovies").val();
    var pageNum = $(".apageNum").val();

    var add=getHost()+"/movies/search?";
    if (numMovies!=0){
        add=add+"limit="+numMovies;
    }
    else {
        numMovies=10;
        add=add+"limit="+numMovies;
    }
    if (pageNum!=0&& pageNum!=1){
        add=add+"&offset="+(pageNum-1)*numMovies;
        pageNumber=pageNum;
    }
    else {
        add=add+"&offset=0";
        pageNumber=0;
    }
    if (title.length!=0){
        add=add+"&title="+title;
    }
    if (genre.length!=0){
        add=add+"&genre="+genre;
    }
    if (direct.length!=0){
        add=add+"&director="+direct;
    }
    if (year.length!=0){
        add=add+"&year="+year;
    }
    add=add+"&sortby="+sortBy;
    add=add+"&direction="+orderBy;

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectA,
        statusCode:{400:check400
        }
    });
});

$(".byGenreForm").submit(function (event) {
    setFalse();
    genreFn = true;
    advanceSearchPage=1;
    event.preventDefault();
    checkLogin();
    console.log("hit basicSearchForm");

    var genre = $(".ggenre").val();
    var sortBy = $(".asortBy").val();
    var orderBy = $(".aorderBy").val();
    var numMovies = $(".anumMovies").val();
    var pageNum = $(".apageNum").val();

    var add=getHost()+"/movies/search?";
    if (numMovies!=0){
        add=add+"limit="+numMovies;
    }
    else {
        numMovies=10;
        add=add+"limit="+numMovies;
    }
    if (pageNum!=0&& pageNum!=1){
        add=add+"&offset="+(pageNum-1)*numMovies;
        pageNumber=pageNum;
    }
    else {
        add=add+"&offset=0";
        pageNumber=0;
    }
    if (genre.length!=0){
        add=add+"&genre="+genre;
    }
    add=add+"&sortby="+sortBy;
    add=add+"&direction="+orderBy;

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectA,
        statusCode:{400:check400
        }
    });
});

$(".byLetterForm").submit(function (event) {
    setFalse();
    letter = true;
    advanceSearchPage=1;
    event.preventDefault();
    checkLogin();
    console.log("hit advanceSearchForm");

    var title = $(".letters").val();
    var sortBy = $(".asortBy").val();
    var orderBy = $(".aorderBy").val();
    var numMovies = $(".anumMovies").val();
    var pageNum = $(".apageNum").val();

    var add=getHost()+"/movies/search?";
    if (numMovies!=0){
        add=add+"limit="+numMovies;
    }
    else {
        numMovies=10;
        add=add+"limit="+numMovies;
    }
    if (pageNum!=0&& pageNum!=1){
        add=add+"&offset="+(pageNum-1)*numMovies;
        pageNumber=pageNum;
    }
    else {
        add=add+"&offset=0";
        pageNumber=0;
    }
    if (title.length!=0){
        add=add+"&title="+title;
    }
    add=add+"&sortby="+sortBy;
    add=add+"&direction="+orderBy;

    advanceSearchPage=1;

    console.log(add);
    email=getEmail();
    sessionID=getSessionID();
    $.ajax({
        method:"GET",
        url:add,
        headers:{
            "email":email,
            "sessionID":sessionID
        },
        success:handleRedirectA,
        statusCode:{400:check400
        }
    });
});

function handleRedirectA(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession1();

        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");

    if (sessionID!=null) {
        setSessionID(sessionID);
    }
    // debugger;
    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleA
    });
}
function handleA(res,textstatus,xhr) {
    var i=0;
    console.log(xhr.status);
    if (xhr.status==204){
        wait(500);
        i++;
        if (i==20){
            window.alert("error loading");
            location.reload();
        }
        handleRedirectA(res,textstatus,xhr);
    }
    else {
        handleResultA(res);
    }
}
function handleResultA(res) {
    showSearchResults();
    console.log(res);
    //debugger;
    var movieDom = $('.browseResults');
    movieDom.empty(); // Clear the previous results

    // Manually build the HTML Table with the response
    var rowHTML = "<table border=\"1\" class='paginated'><tr><th>Title</th><th>Director</th><th>Year</th><th>Rating</th></tr><tbody>";
    var movieList = res.movies;

    if (movieList.length==0){
        var details = "<p>No Movies in this page, Search lower page number</p>"
        movieDom.append(details);
        return;
    }

    for (var i = 0; i < movieList.length; ++i) {
        rowHTML += "<tr>";
        var movieObject = movieList[i];
        var movieId = movieObject["movieId"];
        rowHTML += '<td><a onclick=getMovieByID("'+movieId+'")>'+ movieObject["title"] + '</a></td>';
        rowHTML += "<td>" + movieObject["director"] + "</td>";
        rowHTML += "<td>" + movieObject["year"] + "</td>";
        rowHTML += "<td>" + movieObject["rating"] + "</td>";
        rowHTML += "</tr>";
    }
    rowHTML += "</tbody></table><br>";
    rowHTML += "<button onclick='previousPageAdvance()' style='alignment: left'>previous</button>";
    rowHTML += "<button onclick='nextPageAdvance()' style='alignment: right'>next</button>";
    rowHTML += "<p>Page Number:"+pageNumber+"</p>";

    //debugger;
    movieDom.append(rowHTML);

    window.location.href = "#browseResults"
}

$(document).ready(function () {
    $("#byDetails").click(function () {
        $("#advanceSearchDiv").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#byGenreM").click(function () {
        $("#byGenre").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#byL").click(function () {
        $("#byFirstLetter").slideToggle("slow");
    });
});
$(document).ready(function () {
    $("#optionsx").click(function () {
        $("#options").slideToggle("slow");
    });
});

function previousPageAdvance() {
    if (advanceSearchPage==1){
        return;
    }
    advanceSearchPage--;
    var add=getHost()+"/movies/search?";
    var title;
    var genre;
    var year ;
    var direct;
    var sortBy ;
    var orderBy ;
    var numMovies ;
    var pageNum = advanceSearchPage;

    if (advance){
        title = $(".atitle").val();
        genre = $(".agenre").val();
        year = $(".ayear").val();
        direct = $(".direct").val();
        sortBy = $(".asortBy").val();
        orderBy = $(".aorderBy").val();
        numMovies = $(".anumMovies").val();

        if (numMovies!=0){
            add=add+"limit="+numMovies;
        }
        else {
            numMovies=10;
            add=add+"limit="+numMovies;
        }
        if (pageNum!=0&& pageNum!=1){
            add=add+"&offset="+(pageNum-1)*numMovies;
            pageNumber=pageNum;
        }
        else {
            add=add+"&offset=0";
            pageNumber=0;
        }
        if (title.length!=0){
            add=add+"&title="+title;
        }
        if (genre.length!=0){
            add=add+"&genre="+genre;
        }
        if (direct.length!=0){
            add=add+"&director="+direct;
        }
        if (year.length!=0){
            add=add+"&year="+year;
        }
        add=add+"&sortby="+sortBy;
        add=add+"&direction="+orderBy;

        console.log(add);
        email=getEmail();
        sessionID=getSessionID();
        $.ajax({
            method:"GET",
            url:add,
            headers:{
                "email":email,
                "sessionID":sessionID
            },
            success:handleRedirectA,
            statusCode:{400:check400
            }
        });
    }
    else if (genreFn){
        genre = $(".ggenre").val();
        sortBy = $(".asortBy").val();
        orderBy = $(".aorderBy").val();
        numMovies = $(".anumMovies").val();
        pageNum = advanceSearchPage;

        if (numMovies!=0){
            add=add+"limit="+numMovies;
        }
        else {
            numMovies=10;
            add=add+"limit="+numMovies;
        }
        if (pageNum!=0&& pageNum!=1){
            add=add+"&offset="+(pageNum-1)*numMovies;
            pageNumber=pageNum;
        }
        else {
            add=add+"&offset=0";
            pageNumber=0;
        }
        if (genre.length!=0){
            add=add+"&genre="+genre;
        }
        add=add+"&sortby="+sortBy;
        add=add+"&direction="+orderBy;

        console.log(add);
        email=getEmail();
        sessionID=getSessionID();
        $.ajax({
            method:"GET",
            url:add,
            headers:{
                "email":email,
                "sessionID":sessionID
            },
            success:handleRedirectA,
            statusCode:{400:check400
            }
        });
    }
    else if(letter){
        title = $(".letters").val();
        sortBy = $(".asortBy").val();
        orderBy = $(".aorderBy").val();
        numMovies = $(".anumMovies").val();
        //var pageNum = $(".apageNum").val();

        //var add=getHost()+"/movies/search?";
        if (numMovies!=0){
            add=add+"limit="+numMovies;
        }
        else {
            numMovies=10;
            add=add+"limit="+numMovies;
        }
        if (pageNum!=0&& pageNum!=1){
            add=add+"&offset="+(pageNum-1)*numMovies;
            pageNumber=pageNum;
        }
        else {
            add=add+"&offset=0";
            pageNumber=0;
        }
        if (title.length!=0){
            add=add+"&title="+title;
        }
        add=add+"&sortby="+sortBy;
        add=add+"&direction="+orderBy;

        advanceSearchPage=1;

        console.log(add);
        email=getEmail();
        sessionID=getSessionID();
        $.ajax({
            method:"GET",
            url:add,
            headers:{
                "email":email,
                "sessionID":sessionID
            },
            success:handleRedirectA,
            statusCode:{400:check400
            }
        });
    }
}
function nextPageAdvance() {
    advanceSearchPage++;
    var add=getHost()+"/movies/search?";
    var title;
    var genre;
    var year ;
    var direct;
    var sortBy ;
    var orderBy ;
    var numMovies ;
    var pageNum = advanceSearchPage;

    if (advance){
        title = $(".atitle").val();
        genre = $(".agenre").val();
        year = $(".ayear").val();
        direct = $(".direct").val();
        sortBy = $(".asortBy").val();
        orderBy = $(".aorderBy").val();
        numMovies = $(".anumMovies").val();

        if (numMovies!=0){
            add=add+"limit="+numMovies;
        }
        else {
            numMovies=10;
            add=add+"limit="+numMovies;
        }
        if (pageNum!=0&& pageNum!=1){
            add=add+"&offset="+(pageNum-1)*numMovies;
            pageNumber=pageNum;
        }
        else {
            add=add+"&offset=0";
            pageNumber=0;
        }
        if (title.length!=0){
            add=add+"&title="+title;
        }
        if (genre.length!=0){
            add=add+"&genre="+genre;
        }
        if (direct.length!=0){
            add=add+"&director="+direct;
        }
        if (year.length!=0){
            add=add+"&year="+year;
        }
        add=add+"&sortby="+sortBy;
        add=add+"&direction="+orderBy;

        console.log(add);
        email=getEmail();
        sessionID=getSessionID();
        $.ajax({
            method:"GET",
            url:add,
            headers:{
                "email":email,
                "sessionID":sessionID
            },
            success:handleRedirectA,
            statusCode:{400:check400
            }
        });
    }
    else if (genreFn){
        genre = $(".ggenre").val();
        sortBy = $(".asortBy").val();
        orderBy = $(".aorderBy").val();
        numMovies = $(".anumMovies").val();
        pageNum = advanceSearchPage;

        if (numMovies!=0){
            add=add+"limit="+numMovies;
        }
        else {
            numMovies=10;
            add=add+"limit="+numMovies;
        }
        if (pageNum!=0&& pageNum!=1){
            add=add+"&offset="+(pageNum-1)*numMovies;
            pageNumber=pageNum;
        }
        else {
            add=add+"&offset=0";
            pageNumber=0;
        }
        if (genre.length!=0){
            add=add+"&genre="+genre;
        }
        add=add+"&sortby="+sortBy;
        add=add+"&direction="+orderBy;

        console.log(add);
        email=getEmail();
        sessionID=getSessionID();
        $.ajax({
            method:"GET",
            url:add,
            headers:{
                "email":email,
                "sessionID":sessionID
            },
            success:handleRedirectA,
            statusCode:{400:check400
            }
        });
    }
    else if(letter){
        title = $(".letters").val();
        sortBy = $(".asortBy").val();
        orderBy = $(".aorderBy").val();
        numMovies = $(".anumMovies").val();
        //var pageNum = $(".apageNum").val();

        //var add=getHost()+"/movies/search?";
        if (numMovies!=0){
            add=add+"limit="+numMovies;
        }
        else {
            numMovies=10;
            add=add+"limit="+numMovies;
        }
        if (pageNum!=0&& pageNum!=1){
            add=add+"&offset="+(pageNum-1)*numMovies;
            pageNumber=pageNum;
        }
        else {
            add=add+"&offset=0";
            pageNumber=0;
        }
        if (title.length!=0){
            add=add+"&title="+title;
        }
        add=add+"&sortby="+sortBy;
        add=add+"&direction="+orderBy;

        advanceSearchPage=1;

        console.log(add);
        email=getEmail();
        sessionID=getSessionID();
        $.ajax({
            method:"GET",
            url:add,
            headers:{
                "email":email,
                "sessionID":sessionID
            },
            success:handleRedirectA,
            statusCode:{400:check400
            }
        });
    }
}