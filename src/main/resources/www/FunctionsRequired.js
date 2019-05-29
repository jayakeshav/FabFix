function getEmail(){
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        var c = ck[i].split('=');
        if (c[0].includes("email")){
            return c[1];
        }
    }
}
function getSessionID(){
    var ck=document .cookie.split(';');
    for(var i=0;i<ck.length;i++){
        var c = ck[i].split('=');
        if (c[0].includes("sessionID")){
            return c[1];
        }
    }
}
function checkLogin(){
    // debugger;
    console.log(document.cookie);
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        var c = ck[i].split('=');
        // console.log(c[0]);
        if (c[0].includes("sessionID")){
            if (c[1].length>0){
                return;
            }
        }
    }
    window.alert("not logged in");
    deleteSession();
    document.location.href="index.html";
    loadLoginPage();
}
function checkLogin1(){
    // debugger;
    console.log(document.cookie);
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        var c = ck[i].split('=');
        // console.log(c[0]);
        if (c[0].includes("sessionID")){
            if (c[1].length>0){
                return;
            }
        }
    }
    // window.alert("not logged in");
    deleteSession();
    document.location.href="index.html";
}
function checkLoginA(){
    // debugger;
    console.log(document.cookie);
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        var c = ck[i].split('=');
        // console.log(c[0]);
        if (c[0].includes("sessionID")){
            if (c[1].length>0){
                return;
            }
        }
    }
    // window.alert("not logged in");
    deleteSessionA();
    document.location.href="../index.html";
}


function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function deleteSession(){
    document.cookie = 'sessionID = "";expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    window.alert("you are logged out... timed out");
    document.location.href="index.html";
    loadLoginPage();
}

function deleteSession1(){
    document.cookie = 'sessionID = "";expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    window.alert("you are logged out... timed out");
    document.location.href="index.html";
    loadLoginPage();
}
function logout(){
    document.cookie = 'sessionID = "";expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    window.alert("you are logged out... timed out");
    document.location.href="Index.html";
    loadLoginPage();
}

function setSessionID(sessionID) {
    if (sessionID!=null)
        document.cookie = 'sessionID ='+sessionID+';path=/';
}

function getToIndexPage() {
    document.location.href="index.html";
}

function getHost() {
    return "http://andromeda-23.ics.uci.edu:2351/api/g";
    // return "http://localhost:6243/api/g";
}
function deleteSessionA(){
    document.cookie = 'sessionID = "";expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    window.alert("you are logged out... timed out");
    document.location.href="../index.html";
}
var c=0;
var images = [
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg"
];

var imageHead = document.getElementById("bestMovies");
var imageLogin = document.getElementById("loginPage");
setInterval(function() {
    console.log(images[c]);
    imageHead.style.backgroundImage = "url("+images[c]+")";
    imageHead.style.backgroundSize = "100% 100%";
    imageLogin.style.backgroundImage = "url("+images[c]+")";
    imageLogin.style.backgroundSize = "100% 100%";
    c = c + 1;
    if (c == images.length) {
        c =  0;
    }
}, 5000);