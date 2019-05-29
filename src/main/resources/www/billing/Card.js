$(".payment").submit(function (event) {
        console.log("hit");
        event.preventDefault(); // Prevent the default form submit event, using ajax instead

        var fname = $(".fname").val();
        var lname = $(".lname").val();
        var ccnum = $(".cardnumber").val();
        var expm = $(".mon").val();
        var expy = $(".expyear").val();
        var cvv = $(".cvv").val();

        var cc = ccnum+""+cvv;
        var exp = "01-"+expm+"-"+expy;
        var text = '{'+
            '"id": "'+cc+'",' +
            '"firstName": "'+fname+'",' +
            '"lastName": "'+lname+'",' +
            '"expiration": "'+exp+'"}';


        console.log(text)
        // $.ajax({
        //     method: "GET", // Declare request type
        //     url: "http://35.235.98.249:8080/api/movies/search?limit=10&offset=10&title=" + title,
        //     success: handleResult, // Bind event handler as a success callback
        // });
    }
);