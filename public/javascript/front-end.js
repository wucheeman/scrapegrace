$(function() {

// drawing on public/assets/js/cats.js

  $(".create-form").on("submit", function(event) {
    event.preventDefault();
    
    var id = $("#articleId").val();

    console.log(id);

    var newNote = {
      title: $("#nt").val().trim(),
      body: $("#nb").val().trim(),
    };

    console.log(newNote);

    // 
    // Send the POST request.
    $.ajax("/articles/" + id, {
      type: "POST",
      data: newNote
    }).then(
      function() {
        console.log("created new note");
        // Reload the page to get the updated list
        //location.reload();
      }
    );
  });








});