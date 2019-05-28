var loginEmail="";
var i=0;
$(".login").submit(function (event) {
        console.log("hit");
        event.preventDefault(); // Prevent the default form submit event, using ajax instead

        loginEmail = $(".loginEmail").val();
        var password = $(".loginPassword").val();

        var object = '{"email":"'+loginEmail+'","password":"'+password+'"}';
        console.log(object);
        var url = getHost()+"/idm/login";
        $.ajax({
                method:"POST",
                url: url,
                contentType: "application/json",
                dataType: "json",
                data: object,
                headers : {
                        "Access-Control-Allow-Origin":"*",
                        "Access-Control-Allow-Headers":"*",
                        "Access-Control-Expose-Headers":"*"
                },
                success:handleRedirectLogin
        });

    }
);

function handleLogin(res) {
        var resultCode = res["resultCode"];
        var message = res["message"];
        var sessionID = res["sessionID"];
        console.log(sessionID);
        // debugger;
        if (resultCode==120){
                document.body.innerHTML = message;
                document.cookie = "email="+loginEmail+";path=/";
                document.cookie = "sessionID="+sessionID+";path=/";

                console.log(document.cookie);
                wait(1000);
                // debugger;
                document.location.href = "index.html";
        }
        else if (resultCode==14){
                window.alert(message);
                wait(1000);
        }
        else{
                window.alert(message);
                wait(1000);
        }

}

function handleRedirectLogin(res,textStatus,xhr) {
        console.log(xhr.getResponseHeader("transactionID"));
        var transactionID = xhr.getResponseHeader("transactionID");
        var delay = xhr.getResponseHeader("delay");
        wait(500);
        $.ajax({
                method:"GET",
                url: getHost()+"/report",
                headers:{
                        email:loginEmail,
                        transactionID:transactionID
                },
                success:handleLoginSuccess
        });
}

function handleLoginSuccess(res,textstatus,xhr) {
        console.log(xhr.status);
        if (xhr.status==204){
            if (i==20){
                i=0;
                window.alert("something went wrong");
                document.location.href = "../index.html"
            }
            i++;
            wait(500);

            handleRedirectLogin(res,textstatus,xhr);
        }
        else {
            i=0;
            handleLogin(res);
        }
}

function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
                end = new Date().getTime();
        }
}

function checkSession() {
        console.log(document.cookie);
        var ck=document.cookie.split(';');
        for(var i=0;i<ck.length;i++){
                var c = ck[i].split('=');
                if (c[0].includes(" sessionID")){
                        if (c[1].length>0){
                                window.alert("already logged in");
                                document.location.href="../index.html";
                                break;
                        }
                }
        }
}