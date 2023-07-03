$(document).ready(function () {
  $("#postcodebtn").click(function () {
    console.log($("#postcodeText").val());
    console.log($("#selCountry").val());
    $.ajax({
      url: "libs/php/getPostCode.php",
      type: "POST",
      dataType: "json",
      data: {
        country: $("#selCountry").val(),
        postcode: $("#postcodeText").val(),
      },
      success: function (data) {
        console.log("successsssss");
        console.log(data)
        const results = data.data.postalcodes;

        if (results.length === 0) {
          console.log(results);
          console.log("postcode not found");
        } else {
          console.log(results);
          for (const result of results) {
            $("#countryCode").html(result.countryCode);
            $("#city").html(result.placeName);
            $("#country").html(result.adminName2);
            $("#lat").html(result.lat);
            $("#lng").html(result.lng);
          }
        }

        $("#postcodeText").val("");
        $("#selCountry").val("");
      },
      error: function (data) {
        console.log("err");
        console.log(data);
      },
    });
  });


// next function call 
$("#wikibtn").click(function () {
    console.log($('#cityInput').val());
    $.ajax({
        url: "libs/php/getWikiData.php",
        type: "POST",
        dataType: "json",
        data: {city: $('#cityInput').val(),},
        success: function (data) {
            let city = $('#cityInput').val().trim();
            let firstLetter = city.charAt(0);
            let firstLetterCap = firstLetter.toUpperCase();
            let letters = city.slice(1); 
            let cityCap = `${firstLetterCap}${letters}`;
            if(data.data.entry === undefined) {
                console.log('data not found')
            } else {
                const realData = data.data.entry;
                const wikiData = $.grep(realData, function(obj) {
                    // if(!obj )
                    // console.log(obj.title)
                        return obj.title === cityCap;

                })
                if (wikiData[0] === undefined) {
                    console.log('city not found');
                } else {
                    console.log(wikiData[0]);
                    let wikiSummary = wikiData[0].summary
                    console.log(wikiSummary);
                    $('#wikiResults').html(wikiSummary);
                    $('#cityInput').val('');

                }
    
                

            }
         

    },
    error: function (data) {
        console.log("err");
        console.log(data);
      }
})
});



});
