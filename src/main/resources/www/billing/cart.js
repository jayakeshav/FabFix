function getParam(target) {
    var urlParams = new URLSearchParams (window.location.search);
    if (urlParams.has(target)){
        return urlParams.get(target);
    }
    else
        return null;
}
// function checkCookie(){
//     console.log(document.cookie);
//     var ck=document.cookie.split(';');
//     for(var i=0;i<ck.length;i++){
//         var c = ck[i].split('=');
//         // console.log(c[0]);
//         if (c[0].includes("sessionID")){
//             return;
//         }
//     }
//     window.alert("not logged in");
//     document.location.href="../LoginPage/LoginPage.html";
// }
function getEmail(){
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        var c = ck[i].split('=');
        if (c[0].includes("email")){
            return c[1];
        }
    }
}
var email = getEmail();
var sessionID = getSessionID();
function loadCart() {
    hideUpdate();
    hideDetails();
    checkLogin1();
    var object = '{"email":"'+email+'"}';
    var url = getHost()+"/billing/cart/retrieve";
    $.ajax({
        method:"POST",
        url: url,
        contentType: "application/json",
        dataType: "json",
        data: object,
        headers : {
            email:email,
            sessionID:sessionID,
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers":"*",
            "Access-Control-Expose-Headers":"*"
        },
        success:handleRedirectCart
    });
}

function handleRedirectCart(res,textStatus,xhr) {
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            deleteSession();

        }
    }
    console.log(xhr.getResponseHeader("transactionID"));
    var transactionID = xhr.getResponseHeader("transactionID");
    var delay = xhr.getResponseHeader("delay");
    wait(500);
    $.ajax({
        method:"GET",
        url: getHost()+"/report",
        headers:{
            email:email,
            transactionID:transactionID
        },
        success:handleY
    });
}
function handleY(res,textstatus,xhr) {
    var i=0;
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            getToIndexPage();
        }
        wait(500);
        handleRedirectCart(res,textstatus,xhr);
    }
    else {
        handleCart(res);
    }
}
var movieID="";
var empty = false;
function handleCart(res) {
    var resultCode = res["resultCode"];
    var message = res["message"];
    var cart = res["items"];
    var insert = "";
    var text = jQuery("#cartLoad");
    text.empty();
    if (resultCode==312){
        text.append(message);
        empty  =true;
    }else {
        console.log(cart);
        insert+="<table class='cart' id='cart' >";
        insert+="<tr><th>Movie</th><th>quantity</th><th>price per unit</th><th>price</th><th>Update Quantity</th></tr>";
        var total=0;
        for(var i=0;i<cart.length;i++){
            var movieID = cart[i]["movieId"];
            var movieTitle = cart[i]["title"];
            var quantity = cart[i]["quantity"];
            var unitPrice = cart[i]["unitPrice"];
            var discount = cart[i]["discount"];
            var actualPrice = unitPrice*discount;
            var totalPrice = quantity*actualPrice;
            unitPrice = unitPrice.toFixed(2);
            actualPrice =  actualPrice.toFixed(2);
            totalPrice = totalPrice.toFixed(2);
            total+=totalPrice;
            insert+="<tr><td>"+movieTitle+"</td><td>"+quantity+"</td><td>" +
                "<del>"+unitPrice+"</del> "+actualPrice+"</td>" +
                "<td>"+totalPrice+"</td><td><a onclick='updateQuantity(\""+movieID+"\")'>updateQuantity</a> " +
                "<a onclick='removeItemFromCart(\""+movieID+"\")'>remove</a></td></tr>";
        }
        // total=total.toFixed(2);
        insert+="<tr>total price: <b>"+total+"</b></tr>";
        insert += "</table>";
        text.append(insert);
    }
}
function removeItemFromCart(movieID) {
    console.log("removing :"+movieID);
    var text = '{ ' +
        '   "email": "'+email+'",' +
        '   "movieId": "'+movieID+'"' +
        '}';
    var url1 = getHost()+"/billing/cart/delete";
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
        success:handleRedirectRemoveFromCart
    });
}
function handleRedirectRemoveFromCart(res,textStatus,xhr) {
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
        success:handleRemove
    });
}
function handleRemove(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectRemoveFromCart(res,textstatus,xhr);
    }
    else {
        handleRemoveResult(res);
    }
}
function handleRemoveResult(res) {
    var resultCode = res["resultCode"];
    window.alert(res["message"]);
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function placeOrder(){
    console.log("place");
    if (empty){
        window.alert("cart is empty");
        return;
    }
    hideall();
    showDetails();
    checkout();
}
function hideall() {
    hidecart();
    hideDetails();
    hideUpdate();
    hideCustomer();
    hideOrders();
}
function hidecart() {
    $(".cart").hide();
}
function showcart() {
    $(".cart").show();
}
function hideDetails() {
    $(".details").hide();
}
function showDetails() {
    $(".details").show();
}
function hideUpdate() {
    $(".update").hide();
}
function showUpdate() {
    $(".update").show();
}
function hideCC() {
    $(".cc").hide();
}
function showCC() {
    $(".cc").show();
}
function hideCustomer() {
    $(".customer").hide();
}
function showCustomer() {
    $(".customer").show();
}
function hideCustomerDetails() {
    $(".customerDetails").hide();
}
function showCustomerDetails() {
    $(".customerDetails").show();
}
function hideOrders() {
    $(".orders").hide();
}
function showOrders() {
    $(".orders").show();
}
function updateQuantity(movieID) {
    showUpdate();
    $(".updateQuantity").submit(function (event) {
        event.preventDefault();
        var newQuantity = $(".updateValue").val();
        if (newQuantity==0) {
            window.alert("enter quantity");
            return;
        }
        var object = '{' +
            '   "email": "'+email+'",' +
            '   "movieId": "'+movieID+'",' +
            '   "quantity": '+newQuantity+'}';
        var url1 = getHost()+"/billing/cart/update";
        sessionID=getSessionID();
        // debugger;
        console.log(object);
        $.ajax({
            method:"POST",
            url: url1,
            contentType: "application/json",
            dataType: "json",
            data: object,
            headers : {
                "email":email,
                "sessionID":sessionID,
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Headers":"*",
                "Access-Control-Expose-Headers":"*"
            },
            success:handleRedirectU
        });
    })
}
function handleRedirectU(res,textStatus,xhr) {
    debugger;
    if(res!=null){
        var resultCode = res["resultCode"];
        if (resultCode!=130){
            devareSession();
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
        success:handleU
    });
}
function handleU(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectU(res,textstatus,xhr);
    }
    else {
        handleUpdate(res);
    }
}

function handleUpdate(res) {
    var resultCode = res["resultCode"];
    var message = res["message"];
    if(resultCode==3110){
        document.body.innerHTML =message;
        wait(500);
        reloadCart();
    }
    else {
        window.alert("failed to update item in cart.. retry")
    }
}

function skipCC() {
    hideCC();
    showCustomer();
    updateCustomer();
}
var ccId="";
function updateCC() {
    $(".cc").submit(function (event) {
        event.preventDefault(); // Prevent the default form submit event, using ajax instead

        var fname = $(".fname").val();
        var lname = $(".lname").val();
        var ccnum = $(".cardnumber").val();
        var expm = $(".mon").val();
        var expy = $(".expyear").val();
        var cvv = $(".cvv").val();

        var cc = ccnum+""+cvv;
        if (cc.length!=19){
            window.alert("invalid Credit Card Details");
            return;
        }
        var exp = expy+"-"+expm+"-01";
        var text = '{'+
            '"id": "'+cc+'",' +
            '"firstName": "'+fname+'",' +
            '"lastName": "'+lname+'",' +
            '"expiration": "'+exp+'"}';
        ccId = cc;
        var url1 = getHost()+"/billing/creditcard/insert";
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
            success:handleRedirectCC
        });
        }
    );
}
function handleRedirectCC(res,textStatus,xhr) {
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
        success:handleCC
    });
}
function handleCC(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectCC(res,textstatus,xhr);
    }
    else {
        handleCreditCard(res);
    }
}
function handleCreditCard(res) {
    var resultCode = res["resultCode"];
    var message = res["message"];
    if (resultCode==325){
        window.alert("credit Card Already Available");
        hideCC();
        showCustomer();
        updateCustomer();
    }
    else if (resultCode==323){
        window.alert("wrong date");
    }
    else if (resultCode==3200){
        hideCC();
        showCustomer();
        updateCustomer();
    }
}
function updateCustomer() {
    $(".customer").submit(function (event) {
        event.preventDefault(); // Prevent the default form submit event, using ajax instead

        var fname = $(".cfname").val();
        var lname = $(".clname").val();
        var address = $(".address").val();
        var text = '{\n' +
            '    "email": "'+email+'",' +
            '    "firstName": "'+fname+'",' +
            '    "lastName": "'+lname+'",' +
            '    "ccId": "'+ccId+'",' +
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
            success:handleRedirectCustomer
        });
    }
    );
}
function handleRedirectCustomer(res,textStatus,xhr) {
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
        success:handleCustomer
    });
}
function handleCustomer(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectCustomer(res,textstatus,xhr);
    }
    else {
        handleCustomerDetails(res);
    }
}
function handleCustomerDetails(res) {
    var resultCode = res["resultCode"];
    if (resultCode==333){
        window.alert("customer already existys");
        placePayPal();
    }
    else if (resultCode==3300){
        checkout();
    }
    else {
        window.alert("wrong details");
        updateCustomer();
    }
}

function checkout() {
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
        success:handleRedirectCustomerDetails
    });
}

function handleRedirectCustomerDetails(res,textStatus,xhr) {
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
        success:handleCustomerDetails1
    });
}
function handleCustomerDetails1(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectCustomerDetails(res,textstatus,xhr);
    }
    else {
        handleCustomerDetailsGet(res);
    }
}
function handleCustomerDetailsGet(res) {
    var resultCode = res["resultCode"];
    if (resultCode==332){
        window.alert("customer does not exist");
        hidecart();
        showCC();
        updateCC();
    }
    else if (resultCode==3320){
        hideCC();
        printCustomerDetails(res);
    }
    else {
        window.alert("wrong details");
        updateCustomer();
    }
}
function printCustomerDetails(res) {
    var details = jQuery(".customerDetails");
    var insert = "<p>";
    var json = res["customer"];
    insert+= "first name:"+json["firstName"]+"<br>";
    insert+= "last name:"+json["lastName"]+"<br>";
    insert+= "credit card:"+json["ccId"]+"<br>";
    insert+= "address:"+json["address"]+"<br></p><br>";
    insert+= "<button onclick='placePayPal()'>check out</button>";

    details.append(insert);
}

function placePayPal() {
    // document.body.innerHTML = "done deal with paypal tomorrow mornning"
    var text = '{' +
        '    "email": "'+email+'"' +
        '}';

    var url1 = getHost()+"/billing/order/place";
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
        success:handleRedirectPayPal
    });
}
function handleRedirectPayPal(res,textStatus,xhr) {
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
        success:handlePayPal
    });
}
function handlePayPal(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectPayPal(res,textstatus,xhr);
    }
    else {
        handlePayPalResult(res);
    }
}

function handlePayPalResult(res) {
    var resultCode = res["resultCode"];
    var redirectURL = res["redirectURL"];
    if (resultCode==342){
        window.alert(res["message"]);
    }
    else if (resultCode == 3400 ){
        window.alert("redirect to paypal");
        console.log(redirectURL);
        debugger;
        $(".paypalPlace").empty();
        $(".paypalPlace").html('<a href="'+redirectURL+'" target="_blank">pay now</a>')
        // window.location.href = redirectURL;
    }
    else{
        window.alert(res["message"]);
        location.reload();
    }
}

function transactionHistory() {
    debugger;
    hideMovies();
    hideCart();
    hideMovie();
    hideBestMovies();
    showTransactions();
    var text = '{' +
        '    "email": "'+email+'"' +
        '}';

    var url1 = getHost()+"/billing/order/retrieve";
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
        success:handleRedirectOrders
    });

}
function handleRedirectOrders(res,textStatus,xhr) {
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
        success:handleOrders
    });
}
function handleOrders(res,textstatus,xhr) {
    console.log(xhr.status);
    if (xhr.status==204){
        if (i==20){
            i=0;
            window.alert("something went wrong");
            document.location.href = "../index.html"
        }
        i++;
        wait(500);
        handleRedirectOrders(res,textstatus,xhr);
    }
    else {
        handleOrderResult(res);
    }
}

function handleOrderResult(res) {
    var resultCode = res["resultCode"];
    var transactionHistory = res["items"];
    if (resultCode==332){
        window.alert(res["message"]);
    }
    else if (resultCode == 3410 ){
        printOrders(transactionHistory);
    }
}
function printOrders(transactions) {
    debugger;
    var div = jQuery(".transactionHistory");
    div.empty();
    var enter = "";
    if (transactions.length==0){
        enter = "no transactions performed yet"
        div.append(enter);
        return;
    }
    for (var i=0; i<transactions.length;i++){
        var transaction = transactions[i];
        enter+="<li id='transaction' class='transaction'>";
        enter+="<b>transaction id:</b>"+transaction["transactionId"]+"<br>";
        enter+="total:"+transaction["amount"]["total"]+" "+transaction["amount"]["currency"]+"<br>";
        enter+="transaction fee:"+transaction["transaction_fee"]["value"]+" "+transaction["transaction_fee"]["currency"]+"<br>";
        enter+="transaction time:"+transaction["update_time"]+"<br>";
        enter+="<u>movies</u>:<br>";
        for (var j=0;j<transaction["items"].length;j++){
            var item = transaction["items"][j];
            var movieTitle = item["movieTitle"];

            enter+="<li id='items' class='items'>";
            if (movieTitle!=null){
                if (movieTitle.length!=0){
                    enter+="movie Title:"+movieTitle+" "
                }
            }
            enter+=" quantity:"+item["quantity"]+" unitPrice:"+item["unit_price"]*item["discount"]+"</li>";
        }
        enter+="</li><br>";
    }
    div.append(enter);
}