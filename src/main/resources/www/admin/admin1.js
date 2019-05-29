var i;
function check400(res) {
    console.log(res);
    debugger;
    if(res!=null){
        var resx = res["responseJSON"];
        console.log(resx);
        var resultCode = resx["resultCode"];
        if (resultCode==131||resultCode==133){
            deleteSessionA();
            console.log(document.cookie);
        }else {
            console.log(res["message"]);
        }
    }
}
$(".addMovieForm").submit(function (event) {
    event.preventDefault();
    checkLoginA();
    var title = $(".title").val();
    var director = $(".director").val();
    var year = $(".year").val();
    var backdropPath = $(".backdropPath").val();
    var posterPath = $(".posterPath").val();
    var budget = $(".budget").val();
    var revenue = $(".revenue").val();
    var overview = $(".overview").val();
    var genre = $(".genre").val();

    var genreObj = ' [ {"id":1, "name": "'+genre+'"}]';

    if (title.length==0 || director.length==0 || year.length==0 || genre.length==0){
        window.alert("enter all required details");
        return;
    }

    if (backdropPath.length!=0){
        backdropPath = '"'+backdropPath+'"';
    }
    else {
        backdropPath=null;
    }
    if (posterPath.length!=0){
        posterPath = '"'+posterPath+'"';
    }else {
        posterPath =null;
    }
    if (overview.length!= 0){
        overview = '"'+overview+'"';
    }else {
        overview=null;
    }
    if (budget.length==0){
        budget=null;
    }
    if (revenue.length==0){
        revenue=null;
    }

    var obj = "";
    obj+=
    '{' +
    '    "title": "'+title+'",' +
    '    "director":"'+director+'",' +
    '    "year": '+year+',' +
    '    "backdrop_path": '+backdropPath+',' +
    '    "budget": '+budget+',' +
    '    "overview": '+overview+','+
    '    "poster_path": '+posterPath+',' +
    '    "revenue": '+revenue+',' +
    '    "genres": '+genreObj+
    '}';
    console.log(obj);
    var email =getEmail();
     var url1 = getHost()+"/movies/add";
     sessionID=getSessionID();
     $.ajax({
         method:"POST",
         url: url1,
         contentType: "application/json",
         dataType: "json",
         data: obj,
         headers : {
             "email":email,
             "sessionID":sessionID,
             "Access-Control-Allow-Origin":"*",
             "Access-Control-Allow-Headers":"*",
             "Access-Control-Expose-Headers":"*"
         },
         success:handleRedirectAddMovies,
         statusCode:{400:check400
         }
     });
 });
 function handleRedirectAddMovies(res,textStatus,xhr) {
     debugger;
     if(res!=null){
         var resultCode = res["resultCode"];
         if (resultCode!=130){
             deleteSessionA();
         }
     }
     console.log(xhr.getResponseHeader("transactionID"));
     var transactionID = xhr.getResponseHeader("transactionID");
     var delay = xhr.getResponseHeader("delay");
     var sessionID = xhr.getResponseHeader("sessionID");
     if (sessionID!=null) {
         setSessionID(sessionID);
     }

     wait(500);
     $.ajax({
         method:"GET",
         url: getHost()+"/report",
         headers:{
             email:email,
             transactionID:transactionID
         },
         success:handleAddMovies
     });
 }
 function handleAddMovies(res,textstatus,xhr) {
     console.log(xhr.status);
     if (xhr.status==204){
         if (i==20){
             i=0;
             window.alert("something went wrong");
             document.location.href = "../index.html"
         }
         i++;
         wait(500);
         handleRedirectAddMovies(res,textstatus,xhr);
     }
     else {
         handleAddMoviesResult(res);
     }
 }
 function handleAddMoviesResult(res) {
     var resultCode = res["resultCode"];
     var transactionHistory = res["items"];
     var message = res["message"];
     if (resultCode==216){
         window.alert(res["message"]);
     }
     else if (resultCode == 214 ){
         window.alert(message);
     }
     else if (resultCode==141){
         window.alert(message)
         // un privileged
     }
 }


 $(".deleteMovieForm").submit(function () {
     checkLoginA();
     console.log("delete movie");
     debugger;
     var id = $(".deleteTitle").val();
     var url = getHost()+"/movies/devare/"+id;
     var email = getEmail();
     var sessionID = getSessionID();

     console.log(url);

     $.ajax({
         method:"DELETE",
         url:url,
         headers:{
             "email":email,
             "sessionID":sessionID,
         },
         success:handleRedirectDeleteMovie,
         statusCode:{400:check400
         }
     });
 });
 function handleRedirectDeleteMovie(res,textStatus,xhr) {
     debugger;
     if(res!=null){
         var resultCode = res["resultCode"];
         if (resultCode!=130){
             deleteSessionA();
         }
     }
     console.log(xhr.getResponseHeader("transactionID"));
     var transactionID = xhr.getResponseHeader("transactionID");
     var delay = xhr.getResponseHeader("delay");
     var sessionID = xhr.getResponseHeader("sessionID");
     if (sessionID!=null) {
         setSessionID(sessionID);
     }

     wait(500);
     $.ajax({
         method:"GET",
         url: getHost()+"/report",
         headers:{
             email:email,
             transactionID:transactionID
         },
         success:handleDeleteMovie
     });
 }
 function handleDeleteMovie(res,textstatus,xhr) {
     console.log(xhr.status);
     if (xhr.status==204){
         if (i==20){
             i=0;
             document.location.href = "../index.html"
         }
         i++;
         wait(500);
         handleRedirectDeleteMovie(res,textstatus,xhr);
     }
     else {
         handleDeleteMovieResult(res);
     }
 }
 function handleDeleteMovieResult(res) {
     var resultCode = res["resultCode"];
     var transactionHistory = res["items"];
     var message = res["message"];
     if (resultCode==240){
         window.alert(message);
     }
     else if (resultCode == 241 ){
         window.alert(message);
     }
     else if (resultCode==141){
         window.alert("insufficient privilege")
         // un privileged
     }
 }

 $(".starAddForm").submit(function (event) {
     event.preventDefault();
     checkLoginA();

     var name = $(".addStarName").val();
     var year = $(".addBirthYear").val();


     if (name.length==0 || year.length==0){
         window.alert("enter all required details");
         return;
     }


     var obj = "";
     obj+=
         '{' +
         '    "name":"'+name+'",' +
         '    "birthYear": '+year+'}';
     console.log(obj);
     var email =getEmail();
     var url1 = getHost()+"/movies/star/add";
     sessionID=getSessionID();
     $.ajax({
         method:"POST",
         url: url1,
         contentType: "application/json",
         dataType: "json",
         data: obj,
         headers : {
             "email":email,
             "sessionID":sessionID,
             "Access-Control-Allow-Origin":"*",
             "Access-Control-Allow-Headers":"*",
             "Access-Control-Expose-Headers":"*"
         },
         success:handleRedirectAddStar,
         statusCode:{400:check400
         }
     });
 });
 function handleRedirectAddStar(res,textStatus,xhr) {
     debugger;
     if(res!=null){
         var resultCode = res["resultCode"];
         if (resultCode!=130){
             deleteSessionA();
         }
     }
     console.log(xhr.getResponseHeader("transactionID"));
     var transactionID = xhr.getResponseHeader("transactionID");
     var delay = xhr.getResponseHeader("delay");
     var sessionID = xhr.getResponseHeader("sessionID");
     if (sessionID!=null) {
         setSessionID(sessionID);
     }

     wait(500);
     $.ajax({
         method:"GET",
         url: getHost()+"/report",
         headers:{
             email:email,
             transactionID:transactionID
         },
         success:handleAddStar
     });
 }
 function handleAddStar(res,textstatus,xhr) {
     console.log(xhr.status);
     if (xhr.status==204){
         if (i==20){
             i=0;
             window.alert("something went wrong");
             document.location.href = "../index.html"
         }
         i++;
         wait(500);
         handleRedirectAddStar(res,textstatus,xhr);
     }
     else {
         handleAddStarResult(res);
     }
 }
 function handleAddStarResult(res) {
     var resultCode = res["resultCode"];
     var transactionHistory = res["items"];
     var message = res["message"];
     window.alert(message);
 }

$(".starAddToMovieForm").submit(function (event) {
    event.preventDefault();
    checkLoginA();

    var movie = $(".movieId").val();
    var star = $(".starIDtoMovie").val();


    if (movie.length==0 || star.length==0){
        window.alert("enter all required details");
        return;
    }


    var obj = "";
    obj+=
        '{' +
        '    "starid":"'+star+'",' +
        '    "movieid": "'+movie+'"}';
    console.log(obj);
    var email =getEmail();
    var url1 = getHost()+"/movies/star/starsin";
    sessionID=getSessionID();
    $.ajax({
        method:"POST",
        url: url1,
        contentType: "application/json",
        dataType: "json",
        data: obj,
        headers : {
            "email":email,
            "sessionID":sessionID,
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"*",
            "Access-Control-Expose-Headers":"*"
        },
        success:handleRedirectAddStarToMovie,
        statusCode:{400:check400
        }
    });
});
function handleRedirectAddStarToMovie(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSessionA();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleAddStarToMovie
    });
}
function handleAddStarToMovie(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectAddStarToMovie(res,textstatus,xhr);
    }
    else {
        handleAddStarToMovieResult(res);
    }
}
function handleAddStarToMovieResult(res) {
    var resultCode = res["resultCode"];
    var transactionHistory = res["items"];
    var message = res["message"];
    window.alert(message);
}

$(".genreAddForm").submit(function (event) {
    event.preventDefault();
    checkLoginA();

    var genre = $(".genreAdd").val();

    if (genre.length==0){
        window.alert("enter all required details");
        return;
    }

    var obj = "";
    obj+= '{"name":"'+genre+'"}';
    console.log(obj);

    var email =getEmail();
    var url1 = getHost()+"/movies/genre/add";
    sessionID=getSessionID();
    $.ajax({
        method:"POST",
        url: url1,
        contentType: "application/json",
        dataType: "json",
        data: obj,
        headers : {
            "email":email,
            "sessionID":sessionID,
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"*",
            "Access-Control-Expose-Headers":"*"
        },
        success:handleRedirectAddGenre,
        statusCode:{400:check400}
    });
});
function handleRedirectAddGenre(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSessionA();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleAddGenre
    });
}
function handleAddGenre(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectAddGenre(res,textstatus,xhr);
    }
    else {
        handleAddGenreResult(res);
    }
}
function handleAddGenreResult(res) {
    var resultCode = res["resultCode"];
    var transactionHistory = res["items"];
    var message = res["message"];
    window.alert(message);
}

$(".addCustomerForm").submit(function (event) {
    event.preventDefault(); // Prevent the default form submit event, using ajax instead
    checkLoginA();
        var fname = $(".fname").val();
        var lname = $(".lname").val();
        var address = $(".address").val();
        var ccid = $(".ccId").val();
        var email = $(".email").val();

        var text = '{\n' +
            '    "email": "'+email+'",' +
            '    "firstName": "'+fname+'",' +
            '    "lastName": "'+lname+'",' +
            '    "ccId": "'+ccid+'",' +
            '    "address": "'+address+'"' +
            '}';

        var url1 = getHost()+"/billing/customer/insert";
        console.log(text);
        sessionID=getSessionID();
        $.ajax({
            method:"POST",
            url: url1,
            contentType: "application/json",
            dataType: "json",
            data: text,
            headers : {
                "email":email,
                "sessionID":sessionID,
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Headers":"*",
                "Access-Control-Expose-Headers":"*"
            },
            success:handleRedirectAddCustomer,
            statusCode:{400:check400}
        });
    });
function handleRedirectAddCustomer(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSessionA();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleAddCustomer
    });
}
function handleAddCustomer(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectAddCustomer(res,textstatus,xhr);
    }
    else {
        handleAddCustomerResult(res);
    }
}
function handleAddCustomerResult(res) {
    var resultCode = res["resultCode"];
    var transactionHistory = res["items"];
    var message = res["message"];
    window.alert(message);
}

$(".updateCustomerForm").submit(function (event) {
    event.preventDefault(); // Prevent the default form submit event, using ajax instead
    checkLoginA();
    var fname = $(".nfname").val();
    var lname = $(".nlname").val();
    var address = $(".naddress").val();
    var ccid = $(".nccId").val();
    var email = $(".nemail").val();

    var text = '{\n' +
        '    "email": "'+email+'",' +
        '    "firstName": "'+fname+'",' +
        '    "lastName": "'+lname+'",' +
        '    "ccId": "'+ccid+'",' +
        '    "address": "'+address+'"' +
        '}';

    var url1 = getHost()+"/billing/customer/update";
    console.log(text);
    sessionID=getSessionID();
    $.ajax({
        method:"POST",
        url: url1,
        contentType: "application/json",
        dataType: "json",
        data: text,
        headers : {
            "email":email,
            "sessionID":sessionID,
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"*",
            "Access-Control-Expose-Headers":"*"
        },
        success:handleRedirectUpdateCustomer,
        statusCode:{400:check400}
    });
});
function handleRedirectUpdateCustomer(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSessionA();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleUpdateCustomer
    });
}
function handleUpdateCustomer(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectUpdateCustomer(res,textstatus,xhr);
    }
    else {
        handleUpdateCustomerResult(res);
    }
}
function handleUpdateCustomerResult(res) {
    var resultCode = res["resultCode"];
    var transactionHistory = res["items"];
    var message = res["message"];
    window.alert(message);
}

$(".viewCustomerForm").submit(function (event) {
    checkLoginA();
    var email = $(".uemail").val();
    var text = '{' +
        '    "email": "'+email+'"' +
        '}';
    var url1 = getHost()+"/billing/customer/retrieve";
    console.log(text);
    sessionID=getSessionID();
    $.ajax({
        method:"POST",
        url: url1,
        contentType: "application/json",
        dataType: "json",
        data: text,
        headers : {
            "email":email,
            "sessionID":sessionID,
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"*",
            "Access-Control-Expose-Headers":"*"
        },
        success:handleRedirectCustomerView
    });
});
function handleRedirectCustomerView(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSessionA();
        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    var sessionID = xhr.getResponseHeader("sessionID");
    if (sessionID!=null) {
        setSessionID(sessionID);
    }

    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleCustomerView
    });
}
function handleCustomerView(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectCustomerView(res,textstatus,xhr);
    }
    else {
        handleCustomerViewGet(res);
    }
}
function handleCustomerViewGet(res) {
    var resultCode = res["resultCode"];
    if (resultCode==332){
        window.alert("customer does not exist");
    }
    else if (resultCode==3320){
        printCustomerDetails(res);
    }
    else {
        window.alert("wrong details");}
}
function printCustomerDetails(res) {
    var resultCode = res["resultCode"];
    if (resultCode!=3320){
        window.alert(res["message"]);
        return;
    }
    var details = jQuery(".viewDetails");
    var insert = "<p>";
    var json = res["customer"];
    insert+= "<b>first name:</b>"+json["firstName"]+"<br>";
    insert+= "<b>last name:</b>"+json["lastName"]+"<br>";
    insert+= "<b>credit card:</b>"+json["ccId"]+"<br>";
    insert+= "<b>address:</b>"+json["address"]+"<br></p>";

    details.append(insert);
}