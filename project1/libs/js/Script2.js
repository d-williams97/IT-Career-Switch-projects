$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

$(document).ready(function () {
  let map;
  let countryData;
  let countryNames;
  let countryCodes;

  if (navigator.geolocation) {
    function showPosition(position) {
      let defaultLat = position.coords.latitude;
      let defaultLong = position.coords.longitude;
      // ------------------------- INITIALIZE MAP -------------------------- //
      let tileLayer1 = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
        }
      );

      map = L.map("map", {
        center: [defaultLat, defaultLong],
        zoom: 13,
        layers: [tileLayer1],
      });
    }

    function geoError(err) {
      console.log(err.message);
      let tileLayer1 = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "OpenStreetMap",
        }
      );
      map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [tileLayer1],
      });
    }

    navigator.geolocation.getCurrentPosition(showPosition, geoError);

    // ------------------------- FETCHING JSON DATA -----------------------//
    $.ajax({
      url: "libs/php/getLocalJson.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          countryData = result.data;
          // ------------------------- CREATING COUNTRY HTML LIST ----------------------- //
          $.map(countryData, function (country, i) {
            countryNames = country.countryName;
            countryCodes = country.ISO;
            $("#selectCountry").append(
              `<option value='${countryCodes}'>${countryNames}</option>`
            );
            // ------------------------- Getting POLYGONDATA----------------------- //
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  //// ------------------------- COUNTRY LIST CHANGE EVENT ----------------------- /////////
  let currentPolygonLayer;
  let currentMarker;
  let geoNameLat;
  let geoNameLng;

  let wikiEasyButton;
  let countryBasicDataButton;
  let weatherEasyButton;

  let selectedCountryCode;
  let selectedCountryName;

  $("#selectCountry").on("change", function () {
    if (currentPolygonLayer) {
      map.removeLayer(currentPolygonLayer);
    }

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    if (wikiEasyButton) {
      wikiEasyButton.removeFrom(map);
    }

    if (countryBasicDataButton) {
      countryBasicDataButton.removeFrom(map);
    }

    if (weatherEasyButton) {
      weatherEasyButton.removeFrom(map);
    }

    selectedCountryCode = $(this).val();
    selectedCountryName = $("#selectCountry :selected").text();


    //--------- AJAX CALL TO RETRIEVE LAT,LNG & BOUNDS DATA ------------------//
    $.ajax({
      url: "libs/php/getOpenCageData.php",
      type: "POST",
      dataType: "json",
      data: {
        countryName: selectedCountryName,
        countryCode: selectedCountryCode,
      },
      success: function (result) {
        if (result.status.name == "ok") {
          console.log(result);

          // ---- LAT,LNG DATA ----- //
          const geoNameCountryData = result.data.results[0];
          geoNameLat = geoNameCountryData.geometry.lat;
          geoNameLng = geoNameCountryData.geometry.lng;
          const markerLatLng = L.latLng(geoNameLat, geoNameLng);
          currentMarker = L.marker(markerLatLng);
          currentMarker.addTo(map);

          // ----- GETTING BOUNDS DATA & CHANGING MAP VIEW------ //
          const countryBoundsObj = result.data.results[0].bounds;
          const countryBoundsData = Object.values(countryBoundsObj);
          console.log(countryBoundsData);
          map.fitBounds(countryBoundsData);


           // ----------------- WEATHER API CALL --------------------//
        console.log(geoNameLat,geoNameLng)

        $.ajax({
          url: "libs/php/getOpenWeather.php",
          type: "POST",
          dataType: "json",
          data: { latitude: geoNameLat,
          longitude: geoNameLng,
        countryName: selectedCountryName},
          success: function (result) {
            if (result.status.name == "ok") {
              const weatherData = result.data;
              console.log(result.data);
              let temp = weatherData.main.temp;
              console.log(temp);
              let feelsLikeTemp = weatherData.main.feels_like
              console.log(feelsLikeTemp);
              let weatherDescription = weatherData.weather[0].description;
              console.log(weatherDescription);
              let humidity = weatherData.main.humidity;
              console.log(humidity);
              let iconCode = weatherData.weather[0].icon;
              console.log(iconCode);
              let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

              $('#temp').html(temp);
              $('#feelsLikeTemp').html(feelsLikeTemp);
              $('#weatherDescription').html(weatherDescription);
              $('#humidity').html(humidity);
              $('#weatherIcon').attr('src',iconUrl);
              $('#weatherCountryName').html(selectedCountryName);

        // ---------Add the Easy Button to the map ------------ //
                weatherEasyButton = L.easyButton(
                  "fa-solid fa-cloud fa-beat fa-lg",
                  function (btn, map) {
                    $("#weatherModal").modal("show");
                  }
                );
                weatherEasyButton.addTo(map);
    
              }
            },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
      });











        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });

    // ------------ ADDING A COUNTRY LAYER  ---------------//
    let selectedCountry = $.grep(countryData, function (e) {
      return e.countryName === selectedCountryName;
    });
    let selectedCountryCoords = selectedCountry[0].polygon[0];
    let latLng = [];
    for (const coords of selectedCountryCoords) {
      // console.log(coords); //goes through all coords
      let lat = coords[1]; // Latitude (y-coordinate) is the second element in the array
      // console.log(lat);
      let lng = coords[0]; // Longitude (x-coordinate) is the first element in the array.
      let point = L.latLng(lat, lng);
      // console.log(point);
      latLng.push(point);
    }
    // console.log(selectedCountryCoords);
    // console.log(latLng);

    currentPolygonLayer = L.polygon(latLng)
      .setStyle({
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      })
      .addTo(map);



      
    // ----------------- GEONAMES BASIC DATA API CALL --------------------//
    let countryBasicData;
    let countryBasicArea;
    $.ajax({
      url: "libs/php/getGeoNamesBasicData.php",
      type: "POST",
      dataType: "json",
      data: { countryCode: selectedCountryCode,
      countryName: selectedCountryName},
      success: function (result) {
        if (result.status.name == "ok") {
          countryBasicData = result.data.geonames[0];
          console.log(countryBasicData);
          countryBasicPopulation = parseFloat(countryBasicData.population)
          countryBasicArea = parseFloat(countryBasicData.areaInSqKm)
          countryBasicDataButton = L.easyButton(
            "fa-solid fa-info fa-beat fa-lg",
            function (btn, map) {
              $('#basicCountryName').html(selectedCountryName);
              $('#basicCapitalCity').html(countryBasicData.capital);
              $('#basicContinent').html(countryBasicData.continentName);
              $('#basicPopulation').html(countryBasicPopulation.toLocaleString('en-gb'));
              $('#basicArea').html(countryBasicArea.toLocaleString('en-gb'));
              $("#basicDataModal").modal("show");
            
            }
          );
          countryBasicDataButton.addTo(map);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });



    // ----------------- WIKI API CALL --------------------//
    let wikiSummary;
    let wikiUrl;
    let wikiImg;
    $.ajax({
      url: "libs/php/getWikiAPI.php",
      type: "POST",
      dataType: "json",
      data: { country: selectedCountryName },
      success: function (result) {
        if (result.status.name == "ok") {
          console.log(result);
          if (result.status === undefined) {
            console.log("data not found");
          } else {
            const resultsData = result.data.geonames;
            console.log(resultsData);
            const wikiObj = $.grep(resultsData, function (obj) {
              return obj.title === selectedCountryName;
            });
            const wikiData = wikiObj[0];
            console.log(wikiData);
            if (wikiData === undefined) {
              console.log("country data not found");
            } else {
              wikiSummary = wikiData.summary;
              wikiUrl = wikiData.wikipediaUrl;
              $("#wikiTitle").html(selectedCountryName);
              $("#wikiCountrySummary").html(wikiSummary);
              $("#wikiCountryLink").attr('href',`https://${wikiUrl}`)
            }
            if (!wikiData.thumbnailImg) {
              console.log("image not found");
              wikiImg = 'libs/assets/imageNotFound.png'
              $("#wikiImg").attr("src", wikiImg);
            } else {
              wikiImg = wikiData.thumbnailImg;
              $("#wikiImg").attr("src", wikiImg);
            }


    // ---------Add the Easy Button to the map ------------ //
            wikiEasyButton = L.easyButton(
              "fa-brands fa-wikipedia-w fa-beat fa-lg",
              function (btn, map) {
                $("#wikiModal").modal("show");
              }
            );
            wikiEasyButton.addTo(map);

          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });


       








  
  });
});
