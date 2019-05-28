$(".payment").submit(function (event) {
        console.log("hit");
        event.preventDefault(); // Prevent the default form submit event, using ajax instead

        let fname = $(".fname").val();
        let lname = $(".lname").val();
        let ccnum = $(".cardnumber").val();
        let expm = $(".mon").val();
        let expy = $(".expyear").val();
        let cvv = $(".cvv").val();

        let cc = ccnum+""+cvv;
        let exp = "01-"+expm+"-"+expy;
        let text = '{'+
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