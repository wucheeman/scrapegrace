$(function() {

// scrape news and display it
$("#scrapeAndShow").on("click", function(event) {
  event.preventDefault();
  
  $.ajax("/scraped", {
    type: "GET"
  }).then(
    function() {
      $.ajax("/articles", {
        type: "GET"
      }).then(
        function(data){
          console.log(data);
          window.location.replace("/articles");
          //location.reload();
      });
    });
  });

  // create note
  $(".create-form").on("submit", function(event) {
    event.preventDefault();
    
    var id = $(this).find(".articleId").val();

    var newNote = {
      body: $(this).find("#nb").val().trim(),
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

  // // TODO: remove when no longer needed
  // // get note associated with article
  // $(".comment").on("click", function(event) {
  //   event.preventDefault();
  //   var id = $(this).data("id");
  //   console.log(id);

  //   $.ajax("/articles/" + id, {
  //     type: "GET"
  //   }).then( 
  //     function(data){
  //       console.log(data);
  //   });
  // });


// delete comment handler
$(".delete-group").on("click", function(event) {
  event.preventDefault();

  var id = $(this).find(".noteId").val();
  console.log(id);

  $.ajax("/notes/delete/" + id, {
    type: "GET"
  }).then( 
    function(data){
      console.log(data);
      location.reload();
  });
});

});