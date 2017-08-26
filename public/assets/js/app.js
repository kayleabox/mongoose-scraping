$(document).ready(function(){

$('.modal').modal()

getArticles();

// get articles as a json
function getArticles(){
$.getJSON("/articles", function(data) {
  // for each one
  console.log("get articles");
  for (var i = 0; i < data.length; i++) {

    var link = "https://www.cnn.com" + data[i].link
    // display it on the page
    if(!data[i].saved){
      $("#articles").append("<div class='card row grey lighten-2'><div class='col s8'><p><a data-id='" + data[i]._id 
      + "' state='" + data[i].saved + "' href='"+ link + "' target='_blank'>" + data[i].title 
      + "</a></p></div>" 
      + "<div id=" + data[i]._id + " class='col s4'>" 
      + "<button class='savearticle btn-floating btn-small waves-effect waves-light right'"
      + "state='" + data[i].saved + "' data-id='" + data[i]._id + "'><i class='material-icons'>add</i></button>"
      + "</div>"
      + "</div>");
    }
    else{
      $("#articles").append("<div class='card row teal lighten-5'><div class='col s8'><p><a data-id='" + data[i]._id + "' state='" + data[i].saved 
      + "' href='"+ link + "' target='_blank'>" + data[i].title +"</a></p></div>" 
      + "<div id=" + data[i]._id + " class='col s4'>"
      + "<button class='savearticle btn-floating btn-small waves-effect waves-light right red'"
      +"state='" + data[i].saved + "' data-id='" + data[i]._id + "'>"
      + "<i class='material-icons'>remove</i></button>"
      + "<a class='view-note btn-floating btn-small waves-effect waves-light btn modal-trigger right' data-id='" + data[i]._id 
      + "' href='#notes-modal'><i class='material-icons'>create</i></a></div></div>");
    }
  }
});
}

$(document).on("click", ".view-note", function() {

  $("#notes").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $("#notes").append("<h5>" + data.title + "</h5>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#edit-notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
        $("#edit-notes").append("<button data-id='" + data.note._id + "' id='deletenote'>Delete</button>");

      }
    });
});

$(document).on("click", ".savearticle", function() {
  var thisId = $(this).attr("data-id");
  var saved = $(this).attr("state");
  if(saved === "true"){
    console.log(saved)
    var newsaved = false;
  }
  else{
    var newsaved = true;
  }

  console.log(newsaved)
  $.ajax({
    method: "PUT",
    url: "/save/" + thisId,
    data: {
      saved: newsaved
    }
  }).done(function (data) {
    console.log("saving")
    console.log(data);

    if(!data.saved){
      $("#"+data._id).html("<button class='savearticle btn-floating btn-small waves-effect waves-light right'"
      + "state='" + data.saved + "' data-id='" + data._id + "'><i class='material-icons'>add</i></button>");
    }
    else{
      $("#"+data._id).html("<button class='savearticle btn-floating btn-small waves-effect waves-light right red'"
      +"state='" + data.saved + "' data-id='" + data._id + "'><i class='material-icons'>remove</i></button>"
      + "<a class='view-note btn-floating btn-small waves-effect waves-light btn modal-trigger right' data-id='" + data._id 
      + "' href='#notes-modal'><i class='material-icons'>create</i></a>");
    }    

  });


});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  $.ajax({
    method: "DELETE",
    url: "/remove/" + thisId,
    data: {_id: thisId}
  })
    .done(function(data) {
      console.log(data);
      console.log("deleted")
      $("#notes").empty();
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
});

});