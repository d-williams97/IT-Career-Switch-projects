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
  if (navigator.geolocation) {
    function showPosition(position) {
      let defaultLat = position.coords.latitude;
      let defaultLong = position.coords.longitude;
      let tileLayer1 = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "OpenStreetMap",
        }
      );

      let map = L.map("map", {
        center: [defaultLat, defaultLong],
        zoom: 12,
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


    // ------------------------- INITIALIZE MAP -------------------------- //
    navigator.geolocation.getCurrentPosition(showPosition, geoError);


    // ------------------------- FETCHING JSON DATA -----------------------//

    fetch('http://localhost/ITCS/project1/libs/assets/countryBorders.geo.json')
    .then(response => response.json())
    .then(data => {
        const countryArr = data.features;
        let countries = $.map(countryArr, function(country, i) {
            let countryData = {
                countryName: country.properties.name,
                ISO: country.properties.iso_a2,
                polygon: country.geometry.coordinates
            }
            return countryData
        })

        console.log(countries);
        countries.sort(function(a,b) {
            let countryA = a.countryName;
            let countryB = b.countryName;
            return countryA.localeCompare(countryB);
        })

            // ------------------------- CREATING COUNTRY HTML LIST ----------------------- //

        countryNames = $.map(countries, function(country, i) {
            countryNames = country.countryName;
            $('#selectCountry').append(`<option value=${countryNames}>${countryNames}</option>`)
        });    
    })
    .catch(error => {
        console.log(`Error: ${error}`);
     
    });

  } else {
    console.log("Geolocation is not supported by this browser.");
  }


  //// ------------------------- COUNTRY LIST CHANGE EVENT ----------------------- /////////

  $('#selectCountry').on('change', function() {
    let selectedCountryOption = $(this).val();
    console.log(selectedCountryOption);
  })












  // Map over JSON data for selects //
  //Store data for selected country//
});
