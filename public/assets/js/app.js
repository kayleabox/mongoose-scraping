$(document).ready(function(){

$('.modal').modal()
$('.collapsible').collapsible();


$(document).on("click", ".view-note", function() {

  $("#notes").empty();

  var thisId = $(this).attr("data-id");
  console.log(thisId)

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data.link);
      $("#article-title").attr("href", "https://www.cnn.com" + data.link);
      $("#article-title").text(data.title);
      $("#save-note").attr("action", '/articles/' + data._id);
      $("#save-note").attr("data-id", data._id);

      if (data.note) {
        
        //for(var i = 0; i < data.note.length; i++){
          console.log(data.note._id)
          var note = $(".note");
          note.append('<h6>'+data.note.title+'</h6>');
          note.append('<div>'+data.note.body+'</div>');
          note.append('<form action="/remove/'+data.note._id+'" method="DELETE">'
          +' <button class="btn-small waves-effect waves-light right red"'+ 'data-id="'+data.note._id+'">'
          +' <i class="material-icons">remove</i> Remove </button></form>');
          $("#notes").append(note);
        //}
      }
    });
});


// $(document).on("click", ".savearticle", function() {
//   var thisId = $(this).attr("data-id");
//   var saved = $(this).attr("state");
//   if(saved === "true"){
//     console.log(saved)
//     var newsaved = false;
//   }
//   else{
//     var newsaved = true;
//   }

//   console.log(newsaved)
//   $.ajax({
//     method: "PUT",
//     url: "/save/" + thisId,
//     data: {
//       saved: newsaved
//     }
//   }).done(function (data) {
//     console.log("saving")
//     console.log(data);

//     if(!data.saved){
//       $("#"+data._id).html("<button class='savearticle btn-floating btn-small waves-effect waves-light right'"
//       + "state='" + data.saved + "' data-id='" + data._id + "'><i class='material-icons'>add</i></button>");
//     }
//     else{
//       $("#"+data._id).html("<button class='savearticle btn-floating btn-small waves-effect waves-light right red'"
//       +"state='" + data.saved + "' data-id='" + data._id + "'><i class='material-icons'>remove</i></button>"
//       + "<a class='view-note btn-floating btn-small waves-effect waves-light btn modal-trigger right' data-id='" + data._id 
//       + "' href='#notes-modal'><i class='material-icons'>create</i></a>");
//     }    

//   });


// });

// $(document).on("click", "#savenote", function() {
//   var thisId = $(this).attr("data-id");

//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       title: $("#titleinput").val(),
//       body: $("#bodyinput").val()
//     }
//   })
//     .done(function(data) {
//       console.log(data);
//       $("#notes").empty();
//     });

//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });


// $(document).on("click", "#deletenote", function() {
//   var thisId = $(this).attr("data-id");
//   console.log(thisId)
//   $.ajax({
//     method: "DELETE",
//     url: "/remove/" + thisId,
//     data: {_id: thisId}
//   })
//     .done(function(data) {
//       console.log(data);
//       console.log("deleted")
//       $("#notes").empty();
//       $("#titleinput").val("");
//       $("#bodyinput").val("");
//     });
// });

});