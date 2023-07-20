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

  $("#selectCountry").on("change", function () {

    if (currentPolygonLayer) {
      map.removeLayer(currentPolygonLayer);
    }

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    let selectedCountryCode = $(this).val();
    let selectedCountryName = $("#selectCountry :selected").text();
    console.log(selectedCountryCode, selectedCountryName);

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
        const markerLatLng = L.latLng(geoNameLat, geoNameLng)
        currentMarker = L.marker(markerLatLng)
        currentMarker.addTo(map);

          // ----- GETTING BOUNDS DATA & CHANGING MAP VIEW------ //
          const countryBoundsObj = result.data.results[0].bounds;
          const countryBoundsData = Object.values(countryBoundsObj);
          console.log(countryBoundsData);
          map.fitBounds(countryBoundsData);
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
      console.log(coords); //goes through all coords
      let lat = coords[1]; // Latitude (y-coordinate) is the second element in the array
      console.log(lat);
      let lng = coords[0]; // Longitude (x-coordinate) is the first element in the array.
      let point = L.latLng(lat, lng);
      console.log(point);
      latLng.push(point);
    }
    console.log(selectedCountryCoords);
    console.log(latLng);
    
    currentPolygonLayer = L.polygon(latLng)
      .setStyle({
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      })
      .addTo(map);



      // ------------ WIKI API CALL ---------------//

      let wikiSummary;
      let wikiUrl;
      $.ajax({
        url: "libs/php/getWikiAPI.php",
        type: "POST",
        dataType: "json",
        data: { country: selectedCountryName },
        success: function (result) {
          if (result.status.name == "ok") {
            console.log('success');
            console.log(result);
            if (result.data.entry === undefined) {
              console.log("data not found");
            } else {
              const resultsData = result.data.entry;
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
});
