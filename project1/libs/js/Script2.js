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

    // ------------------------- FETCHING COUNTRY JSON DATA -----------------------//
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



  // ------------ COUNTRY LOCATION DATA API CALL ---------------- //

  async function getGeolocationData(selectedCountryName, selectedCountryCode) {
    try {
      const result = await $.ajax({
        url: "libs/php/getOpenCageData.php",
        type: "POST",
        dataType: "json",
        data: {
          countryName: selectedCountryName,
          countryCode: selectedCountryCode,
        },
      });

      if (result.status.name === "ok") {
        const geoNameCountryData = result.data.results[0];
        geoNameLat = geoNameCountryData.geometry.lat;
        console.log(geoNameLat);
        geoNameLng = geoNameCountryData.geometry.lng;


        // ---- ADDING COUNTRY MARKER TO MAP ----- //
        const markerLatLng = L.latLng(geoNameLat, geoNameLng);
        currentMarker = L.marker(markerLatLng);
        currentMarker.addTo(map);

        // ----- GETTING BOUNDARY DATA & CHANGING MAP VIEW------ //
        const countryBoundsObj = result.data.results[0].bounds;
        const countryBoundsData = Object.values(countryBoundsObj);
        console.log(countryBoundsData);
        map.fitBounds(countryBoundsData);
        // return { geoNameLat, geoNameLng };

      } else {
        throw new Error("Failed to retrieve geolocation data.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  // ----------------- WEATHER DATA API CALL --------------------//


  async function getOpenWeatherData(
    selectedCountryName,
    geoNameLat,
    geoNameLng
  ) {
    try {
      console.log(geoNameLat);
      const result = await $.ajax({
        url: "libs/php/getOpenWeather.php",
        type: "POST",
        dataType: "json",
        data: {
          latitude: geoNameLat,
          longitude: geoNameLng,
          countryName: selectedCountryName,
        },
      });
      console.log(result);
      if (result.status.name == "ok") {
        const weatherData = result.data;
        console.log(result.data);
        let temp = weatherData.main.temp;
        console.log(temp);
        let feelsLikeTemp = weatherData.main.feels_like;
        console.log(feelsLikeTemp);
        let weatherDescription = weatherData.weather[0].description;
        console.log(weatherDescription);
        let humidity = weatherData.main.humidity;
        console.log(humidity);
        let iconCode = weatherData.weather[0].icon;
        console.log(iconCode);
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        $("#temp").html(temp);
        $("#feelsLikeTemp").html(feelsLikeTemp);
        $("#weatherDescription").html(weatherDescription);
        $("#humidity").html(humidity);
        $("#weatherIcon").attr("src", iconUrl);
        $("#weatherCountryName").html(selectedCountryName);

        // ---------Add the Easy Button to the map ------------ //
        weatherEasyButton = L.easyButton(
          "fa-solid fa-cloud fa-beat fa-lg",
          function (btn, map) {
            $("#weatherModal").modal("show");
          }
        );
        weatherEasyButton.addTo(map);
      } else {
        throw new Error("Failed to retrieve openWeather data");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


    // ----------------- GEONAMES BASIC DATA API CALL --------------------//


    async function getGeonamesBasicData(
      selectedCountryName,
      selectedCountryCode
    ) {
      try {
        const result = await $.ajax({
          url: "libs/php/getGeoNamesBasicData.php",
          type: "POST",
          dataType: "json",
          data: {
            countryCode: selectedCountryCode,
            countryName: selectedCountryName,
          },
        });

        if (result.status.name === "ok") {
          const countryBasicData = result.data.geonames[0];
          console.log(countryBasicData);
          currencyCode = countryBasicData.currencyCode;
          const countryBasicPopulation = parseFloat(
            countryBasicData.population
          );
          const countryBasicArea = parseFloat(countryBasicData.areaInSqKm);
          countryBasicDataButton = L.easyButton(
            "fa-solid fa-info fa-beat fa-lg",
            function (btn, map) {
              $("#basicCountryName").html(selectedCountryName);
              $("#basicCapitalCity").html(countryBasicData.capital);
              $("#basicContinent").html(countryBasicData.continentName);
              $("#basicPopulation").html(
                countryBasicPopulation.toLocaleString("en-gb")
              );
              $("#basicArea").html(countryBasicArea.toLocaleString("en-gb"));
              $("#basicDataModal").modal("show");
            }
          );
          countryBasicDataButton.addTo(map);
          return { countryBasicPopulation, countryBasicArea };
        } else {
          throw new Error("Failed to retrieve geonames basic data.");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    // ----------------- WIKI DATA API CALL --------------------//
 

    async function getWikiData(selectedCountryName) {
      try {
        const result = await $.ajax({
          url: "libs/php/getWikiAPI.php",
          type: "POST",
          dataType: "json",
          data: { country: selectedCountryName },
        });

        if (result.status.name === "ok") {
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
              $("#wikiCountryLink").attr("href", `https://${wikiUrl}`);
            }
            if (!wikiData.thumbnailImg) {
              console.log("image not found");
              wikiImg = "libs/assets/imageNotFound.png";
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
          // return { wikiSummary, wikiUrl, wikiImg };
        } else {
          throw new Error("Failed to retrieve wiki data.");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }



        // ----------------- EXCHANGE RATE DATA API CALL --------------------//

        async function getExchangeRateData(currencyCode) {
          console.log(currencyCode);
          try {
            const result = await $.ajax({
              url: "libs/php/getOpenExchangeRate.php",
              type: "POST",
              dataType: "json",
              data: { currencyCode: currencyCode },
            })
            if (result.status.name === "ok") {
              let currencyValue = result.data.rates[currencyCode];
              console.log(currencyValue);
              let roundedCurrencyValue = currencyValue.toFixed(2);
              let currentDate = new Date().toString();
              let realDate = currentDate.split('+')[0];
              // modal //
              $('#erCountry').html(selectedCountryName);
              $('#erValue').html(roundedCurrencyValue);
              $('#erCode').html(currencyCode);
              $('#erDate').html(realDate);
              // Easy Button //
              exchangeRateEasyButton = L.easyButton(
                "fa-solid fa-dollar-sign fa-beat fa-lg",
                function (btn, map) {
                  $("#erModal").modal("show");
                }
              );
              exchangeRateEasyButton.addTo(map);
            } else {
              throw new Error("Failed to retrieve exchange rate data.");
              // exchange rate data not found message to for HTML modal
            }
          } catch (error) {
            console.error(error);
            throw error;
            
          }
        }

                // ----------------- FLAG DATA API CALL --------------------//

        async function getFlagData(selectedCountryName) {
          console.log(selectedCountryName);
          try {
            const result = await $.ajax({
              url: "libs/php/getFlagAPI.php",
              type: "POST",
              dataType: "json",
              data: { countryName: selectedCountryName },
            })
            if (result.status.name === "ok") {
              let flagLink = result.data[0].flags.png;
              $('#flagTitle').html(`${selectedCountryName} Flag`)
              $('#flagImg').attr('src',flagLink);

              // Easy Button //
              flagEasyButton = L.easyButton(
                "fa-solid fa-flag fa-beat fa-lg",
                function (btn, map) {
                  $("#flagModal").modal("show");
                }
              );
              flagEasyButton.addTo(map);
            } else {
              throw new Error("Failed to retrieve flag data.");
              // exchange rate data not found message to for HTML modal
            }
          } catch (error) {
            console.error(error);
            throw error;
            
          }
        }







      //// ------------------------- COUNTRY LIST CHANGE EVENT ----------------------- /////////

      //------ VARIABLES USED IN FUNCTIONS -----//

      let currentPolygonLayer;
      let currentMarker;

      let geoNameLat;
      let geoNameLng;
    
      let wikiEasyButton;
      let countryBasicDataButton;
      let weatherEasyButton;
      let exchangeRateEasyButton;
      let flagEasyButton;
    
      let selectedCountryCode;
      let selectedCountryName;
      let currencyCode;

    $("#selectCountry").on("change", async function () {

      selectedCountryCode = $(this).val();
      selectedCountryName = $("#selectCountry :selected").text();
 
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

      if (exchangeRateEasyButton) {
        exchangeRateEasyButton.removeFrom(map);
      }

      if (flagEasyButton) {
        flagEasyButton.removeFrom(map);
      }

      // ------------ ADDING COUNTRY LAYER  ---------------//
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

      currentPolygonLayer = L.polygon(latLng)
        .setStyle({
          color: "#ff7800",
          weight: 5,
          opacity: 0.65,
        })
        .addTo(map);


        // ------------- ASYNCH API CALLS ------------ //

      try {
        const geolocationData = await getGeolocationData(
          selectedCountryName,
          selectedCountryCode
        );
        const geonamesBasicData = await getGeonamesBasicData(
          selectedCountryName,
          selectedCountryCode
        );
        const openWeatherData = await getOpenWeatherData(
          selectedCountryName,
          geoNameLat,
          geoNameLng
        );
        const wikiData = await getWikiData(selectedCountryName);

        const currencyData = await getExchangeRateData(currencyCode);

        const flagData = await getFlagData(selectedCountryName);

        // Now you have access to geolocationData, wikiData, and geonamesBasicData
        // ... (code to update UI and handle API data)
      } catch (error) {
        console.error(error);
        // Handle errors here
      }
    });
  }
);
