
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
  if (navigator.geolocation) {
    function showPosition(position) {
      let defaultLat = position.coords.latitude;
      let defaultLong = position.coords.longitude;
      // ------------------------- INITIALIZE MAP -------------------------- //
      let tileLayer1 = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "OpenStreetMap",
        }
      );

      map = L.map("map", {
        center: [defaultLat, defaultLong],
        zoom: 5,
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
      let map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [tileLayer1],
      });
    }

    navigator.geolocation.getCurrentPosition(showPosition, geoError);

    // ------------------------- FETCHING JSON DATA -----------------------//
    fetch("http://localhost/ITCS/project1/libs/assets/countryBorders.geo.json")
      .then((response) => response.json())
      .then((data) => {
        const countryArr = data.features;
        let countries = $.map(countryArr, function (country, i) {
          countryData = {
            countryName: country.properties.name,
            ISO: country.properties.iso_a2,
            polygon: country.geometry.coordinates,
          };
          return countryData;
        });
        // console.log(countries);
        countries.sort(function (a, b) {
          let countryA = a.countryName;
          let countryB = b.countryName;
          return countryA.localeCompare(countryB);
        });

        // ------------------------- CREATING COUNTRY HTML LIST ----------------------- //

        countryNames = $.map(countries, function (country, i) {
          countryNames = country.countryName;
          countryCodes = country.ISO;
          $("#selectCountry").append(
            `<option value='${countryCodes}'>${countryNames}</option>`
          );
        });
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        alert(`Error: ${error}`);
      });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  //// ------------------------- COUNTRY LIST CHANGE EVENT ----------------------- /////////

  $("#selectCountry").on("change", function () {
    let selectedCountryCode = $(this).val();
    let selectedCountryName = $("#selectCountry :selected").text();
    console.log(selectedCountryCode, selectedCountryName);

    //--------- AJAX CALL TO RETRIEVE LAT,LNG,BOUNDS DATA ------------------//
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
          let geoNameLat = geoNameCountryData.geometry.lat;
          let geoNameLng = geoNameCountryData.geometry.lng;

          // ----- BOUNDS DATA ------ //
          const countryBoundsObj = result.data.results[0].bounds;
          const countryBoundsData = Object.values(countryBoundsObj);
          console.log(countryBoundsData);

          //--- CHANGE MAP VIEW -------//
          map.fitBounds(countryBoundsData);

          // --- ADD COUNTRY LAYER  -------//
          fetch(
            "http://localhost/ITCS/project1/libs/assets/countryBorders.geo.json"
          )
            .then((response) => response.json())
            .then((data) => {
              let arr = data.features;
              let obj = $.grep(arr, function (e) {
                return e.properties.name === selectedCountryName;
              });
              console.log(obj);
              let countryCoordinates = obj[0].geometry.coordinates[0];

              let latLng = [];
              for (const coords of countryCoordinates) {
                console.log(coords) //goes through all coords
                let lat = coords[1]; // Latitude (y-coordinate) is the second element in the array
                let lng = coords[0]; // Longitude (x-coordinate) is the first element in the array.
                let point = L.latLng(lat, lng);
                console.log(point)
                latLng.push(point);
              }
              console.log(countryCoordinates);
              console.log(latLng);

              L.polygon(latLng)
                .setStyle({
                    color: "#ff7800",
                    weight: 5,
                    opacity: 0.65,
                  })
                .addTo(map);

              // let myLines = [
              //   {
              //     type: "LineString",
              //     coordinates: latLng // or countryCoordinates//
              //   },
              // ];

              // var myStyle = {
              //   color: "#ff7800",
              //   weight: 5,
              //   opacity: 0.65,
              // };

              // L.geoJSON(myLines, {
              //   style: myStyle,
              // }).addTo(map);
            });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      },
    });

    // FINDING ALTERNATIVE COORDINATES//
  });

  // Map over JSON data for selects //
  //Store data for selected country//
});

{/* <script type="application/javascript" src="../assets/countryBorders.geo.json"></script> */}