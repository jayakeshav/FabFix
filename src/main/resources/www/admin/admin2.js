var starPageNumber = 1;
var numStarsPerPage ;
$(".starSearchForm").submit(function (event) {
    event.preventDefault();
    checkLoginA();
    console.log("hit starSearchForm");

    var name = $(".name").val();
    var movie = $(".movie").val();
    var year = $(".year").val();
    var sortBy = $(".sortBy").val();
    var orderBy = $(".orderBy").val();
    var numMovies = $(".numMovies").val();
    var numStars = $(".numStars").val();

    var add=getHost()+"/movies/star/search?";
    add=add+"limit="+numStars;
    starPageNumber=1;
    numStarsPerPage=numStars;
    add=add+"&offset="+(starPageNumber-1)*numStarsPerPage;
    if (name.length!=0){
        add=add+"&name="+name;
    }
    if (year.length!=0){
        add=add+"&birthYear="+year;
    }
    if (movie.length!=0){
        add=add+"&movieTitle="+movie;
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
        success:handleRedirectStars,
        statusCode:{400:check400
        }
    });
});
function handleRedirectStars(res,textStatus,xhr) {
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
        success:handleStars
    });
}
function handleStars(res,textstatus,xhr) {
    var i=0;
    console.log(xhr.status);
    if (xhr.status==204){
        wait(500);
        i++;
        if (i==20){
            window.alert("error loading");
            location.reload();
        }
        handleRedirectStars(res,textstatus,xhr);
    }
    else {
        handleStarsResult(res);
    }
}
function handleStarsResult(res) {
    console.log(res);
    //debugger;
    var starDom = $('.starsDetails');
    starDom.empty(); // Clear the previous results

    // Manually build the HTML Table with the response
    var rowHTML = "<table border=\"1\" class='paginated'><tr><th>Name</th><th>BirthYear</th></tr><tbody>";
    var starList = res["stars"];

    if (starList.length==0){
        var details = "<p>No Movies in this page, Search lower page number</p>"
        starDom.append(details);
        return;
    }

    for (var i = 0; i < starList.length; ++i) {
        rowHTML += "<tr>";
        var starObject = starList[i];
        var starId = starObject["id"];
        console.log(starId);
        rowHTML += '<td><a onclick=getStarById("'+starId+'")>'+ starObject["name"] + '</a></td>';
        rowHTML += "<td>" + starObject["birthYear"] + "</td>";
        rowHTML += "</tr>";
    }
    rowHTML += "</tbody></table><br>";
    rowHTML += "<button onclick='previousStarPage()' style='alignment: left'>previous</button>";
    rowHTML += "<button onclick='nextStarPage()' style='alignment: right'>next</button>";
    rowHTML += "<p>Page Number:"+starPageNumber+"</p>";
    //debugger;
    starDom.append(rowHTML);

    window.location.href = "#browseResults"
}

function previousStarPage() {
    checkLoginA();
    if (starPageNumber==1){
        return;
    }
    starPageNumber--;
    var name = $(".name").val();
    var movie = $(".movie").val();
    var year = $(".year").val();
    var sortBy = $(".sortBy").val();
    var orderBy = $(".orderBy").val();
    var numMovies = $(".numMovies").val();
    var numStars = $(".numStars").val();

    var add=getHost()+"/movies/star/search?";
    add=add+"limit="+numStars;
    numStarsPerPage=numStars;
    add=add+"&offset="+(starPageNumber-1)*numStarsPerPage;
    if (name.length!=0){
        add=add+"&name="+name;
    }
    if (year.length!=0){
        add=add+"&birthYear="+year;
    }
    if (movie.length!=0){
        add=add+"&movieTitle="+movie;
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
        success:handleRedirectStars,
        statusCode:{400:check400
        }
    });
}
function nextStarPage() {
    checkLoginA();
    starPageNumber++;
    var name = $(".name").val();
    var movie = $(".movie").val();
    var year = $(".year").val();
    var sortBy = $(".sortBy").val();
    var orderBy = $(".orderBy").val();
    var numMovies = $(".numMovies").val();
    var numStars = $(".numStars").val();

    var add=getHost()+"/movies/star/search?";
    add=add+"limit="+numStars;
    numStarsPerPage=numStars;
    add=add+"&offset="+(starPageNumber-1)*numStarsPerPage;
    if (name.length!=0){
        add=add+"&name="+name;
    }
    if (year.length!=0){
        add=add+"&birthYear="+year;
    }
    if (movie.length!=0){
        add=add+"&movieTitle="+movie;
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
        success:handleRedirectStars,
        statusCode:{400:check400
        }
    });
}

function getStarById(starID) {
    checkLoginA();
    id = starID;
    var url = getHost()+"/movies/star/"+id;
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
        success:handleRedirectStar
    });
}
function handleRedirectStar(res,textStatus,xhr) {
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
        success:handleStar
    });
}
function handleStar(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (k==20){
            k=0;
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectStar(res,textstatus,xhr);
    }
    else {
        handleResultStar(res);
    }
}
function handleResultStar(res){
    var starDom = $('.starDetails');
    starDom.empty(); // Clear the previous results
    var star = res["stars"];
    var text = '<h4 style="text-align: center">'+star["name"]+'</h4>';
    text+='<p><b>birth Year:</b>'+star["birthYear"]+'</p>';
    text+='<p><b>movies list:</b> comming soon!!!</p>';
    starDom.append(text);
}