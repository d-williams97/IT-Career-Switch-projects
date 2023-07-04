$(document).ready(function () {
  //First API call
  $("#postcodebtn").click(function () {
    $.ajax({
      url: "libs/php/getPostCode.php",
      type: "POST",
      dataType: "json",
      data: {
        country: $("#selCountry").val(),
        postcode: $("#postcodeText").val(),
      },
      success: function (result) {
        if (result.status.name == "ok") {
          // console.log("success");
          // console.log(data);
          const results = result.data.postalcodes;

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
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  // 2nd API call
  $("#wikibtn").click(function () {
    console.log($("#cityInput").val());
    $.ajax({
      url: "libs/php/getWikiData.php",
      type: "POST",
      dataType: "json",
      data: { city: $("#cityInput").val() },
      success: function (result) {
        if (result.status.name == "ok") {
          let city = $("#cityInput").val().trim();
          let firstLetter = city.charAt(0);
          let firstLetterCap = firstLetter.toUpperCase();
          let letters = city.slice(1);
          let cityCap = `${firstLetterCap}${letters}`;
          if (result.data.entry === undefined) {
            console.log("data not found");
          } else {
            const realData = result.data.entry;
            const wikiData = $.grep(realData, function (obj) {
              return obj.title === cityCap;
            });
            if (wikiData[0] === undefined) {
              console.log("city not found");
            } else {
              console.log(wikiData[0]);
              let wikiSummary = wikiData[0].summary;
              console.log(wikiSummary);
              $("#wikiResults").html(wikiSummary);
              $("#cityInput").val("");
            }
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  //   Third API call
  $("#tzbtn").click(function () {
    console.log($("#latInput").val());
    console.log($("#lngInput").val());
    $.ajax({
      url: "libs/php/getTimezone.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: $("#latInput").val(), // A function to be called if the request succeeds.
        lng: $("#lngInput").val(),
      },
      success: function (result) {
        if (result.status.name == "ok") {
          console.log(result);
          if (result.data.status) {
            console.log(result.data.status.message);
          } else {
            $("#timezone").html(result.data.timezoneId);
            $("#sunrise").html(result.data.sunrise);
            $("#sunset").html(result.data.sunset);
          }
          $("#latInput").val("");
          $("#lngInput").val("");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });
});
