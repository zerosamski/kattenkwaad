
$(document).ready(function(){
    $("#prijspu").on("keyup", function() {
      var value = parseInt($(this).val())
      console.log(value)
      var i = 0;
    
      $(".card #theList > li > .uurtarief").each(function() {
          var comp =$(this).text()
          var compnumber = parseInt(comp)
          if (compnumber > value) {
              console.log(`${comp} is too high`)
              $(`.${i}`).hide()
              console.log(i)
              i++;
          }
          else {
              console.log(`${comp} is low enough`)
              $(`.${i}`).show()
              i++;
          }
          
      });

    });
});

  