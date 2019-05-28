var regEmail;
var j;
function redirect(){
    window.location.href = "LoginPage.html";
}
function redirectReg() {
    window.location.href= "RegisterPage.html"
}

function handleredirect(){}

function handlesucessReg(res){
    console.log(res);
    var message=res.message;
    var resultCode = res.resultCode;
    if (resultCode!=110) {
        document.body.innerHTML = message;
        wait(500);
        window.location.reload();
    }
    else {
        window.alert(message);
    }
}

$(".reg").submit(function (event){
    console.log("hit");
    event.preventDefault();
    var inemail = $(".regEmail").val();
    var inpassword = $(".regPass").val();
    var inpassword2 = $(".regPass1").val();
    regEmail=inemail;
    if (inpassword!=inpassword2) {
        window.alert("passwords do not match");
        }
    else {
        var object = '{"email":"'+inemail+'","password":"'+inpassword+'"}';
        console.log(object);
        var url = getHost()+"/idm/register";
        $.ajax({
            method:"POST",
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: object,
            success: handleRedirectReg
        })
    }
});

function handleRedirectReg(res,textStatus,xhr) {
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:regEmail,
            transactionID:transactionID
        },
        success:handle
    });
}

function handle(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (j==20){
            j=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);

        handleRedirectReg(res,textstatus,xhr);
    }
    else {
        j=0;
        handlesucessReg(res);
    }
}