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
    console.log('wiki');
    console.log($('#cityInput').val());

    

});







});
