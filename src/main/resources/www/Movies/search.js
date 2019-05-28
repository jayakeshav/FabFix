function handleResult(res){

}

$("form").submit(function (event) {
    event.preventDefault();

    var title=$(".title").val();
    var director=$(".director").val();
    var year=$(".year").val();
    var genre=$(".genre").val();

    var add="";
    if (title.length!=0){
        add=add+"&title="+title;
    }
    if (director.length!=0){
        add=add+"&director="+director;
    }
    if (year.length!=0){
        add=add+"&year="+year;
    }
    if (genre.length!=0){
        add=add+"&genre="+genre;
    }


    var getUrl = "http://35.235.98.249:8080/api/movies/search?limit=10&offset=10"+add;

    console.log(getUrl);

    // $.ajax({
    //     method:"GET",
    //     url:getUrl,
    //     success:handleResult
    // });
});