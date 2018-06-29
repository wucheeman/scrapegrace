$(function() {

  // create note
  $(".create-form").on("submit", function(event) {
    event.preventDefault();
    
    var id = $("#articleId").val();

    console.log(id);

    var newNote = {
      title: $("#nt").val().trim(),
      body: $("#nb").val().trim(),
    };

    console.log(newNote);

    // Send the POST request.
    $.ajax("/articles/" + id, {
      type: "POST",
      data: newNote
    }).then(
      function() {
        console.log("created new note");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  // get note associated with article
  $(".comment").on("click", function(event) {
    event.preventDefault();
    var id = $(this).data("id");
    console.log(id);

    $.ajax("/articles/" + id, {
      type: "GET"
    }).then( 
      function(data){
        console.log(data);
    });
  });


// need a delete comment handler

// need a see-saved-articles handler

// need a scrape new articles handler


});