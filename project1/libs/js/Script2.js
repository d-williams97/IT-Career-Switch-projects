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
  let defaultLat
  let defaultLong
  let isoCode



  async function changeSelectOption(lat,long
    ) {
      console.log(lat,long)
      try {
        const result = await $.ajax({
          url: "libs/php/getSelectOption.php",
          type: "POST",
          dataType: "json",
          data: {
            lat: lat,
            lng: long,
          }
        });
        if (result.status.name === "ok") {
          isoCode = result.data.countryCode;
          $('#selectCountry').val(isoCode).change();
        } else {
          throw new Error("Failed to get ISO code.");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  
 
  if (navigator.geolocation) {
    function showPosition(position) {
      defaultLat = position.coords.latitude;
      defaultLong = position.coords.longitude;

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
      

      // --- CHANGE SELECT LIST OPTION WITH GEOLOCATION DATA --- //
      changeSelectOption(defaultLat,defaultLong);
    }

    function geoError(err) {
      console.log(err.message);
      defaultLat = 0;
      defaultLong = 0;
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



  // ------------ CHANGE LIST OPTION TO GEOLOACTION COUNTRY -------------------





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
      console.log(result.data.results);
        const geoNameCountryData = result.data.results[0];
        console.log(geoNameCountryData);
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

  // ----------------- GEONAMES BASIC DATA API CALL --------------------//

  async function getGeonamesBasicData(
    selectedCountryName,
    selectedCountryCode
  ) {
    console.log(selectedCountryCode);
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
        console.log(result);
        const countryBasicData = result.data.geonames[0];
        console.log(countryBasicData);
        currencyCode = countryBasicData.currencyCode;
        const countryBasicPopulation = parseFloat(countryBasicData.population);
        const countryBasicArea = parseFloat(countryBasicData.areaInSqKm);
        $("#basicCountryName").html(selectedCountryName);
        $("#basicCapitalCity").html(countryBasicData.capital);
        $("#basicContinent").html(countryBasicData.continentName);
        $("#basicPopulation").html(
          countryBasicPopulation.toLocaleString("en-gb")
        );
        $("#basicArea").html(countryBasicArea.toLocaleString("en-gb"));


        // -- BASIC DATA EASY BUTTON -- //
        countryBasicDataButton = L.easyButton(
          "fa-solid fa-info fa-lg",
          function (btn, map) {
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
        let temp = Math.round(weatherData.main.temp);
        let feelsLikeTemp = Math.round(weatherData.main.feels_like);
        let weatherDescription = weatherData.weather[0].description;
        let humidity = weatherData.main.humidity;
        let iconCode = weatherData.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        $("#temp").html(temp);
        $("#feelsLikeTemp").html(feelsLikeTemp);
        $("#weatherDescription").html(weatherDescription);
        $("#humidity").html(humidity);
        $("#weatherIcon").attr("src", iconUrl);
        $("#weatherCountryName").html(selectedCountryName);

        // ---------Weather Easy Button to the map ------------ //
        weatherEasyButton = L.easyButton(
          "fa-solid fa-cloud fa-lg",
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
          let wikiObj = $.grep(resultsData, function (obj) {
            return obj.title === selectedCountryName
          });
          if (wikiObj.length === 0) {
            wikiObj = $.grep(resultsData, function (obj) {
              return obj;
            })
          }
          const wikiData = wikiObj[0];
          console.log(wikiData);
          if (wikiData === undefined) {
            console.log("country data not found");
          } else {
            wikiSummary = wikiData.summary;
            wikiUrl = wikiData.wikipediaUrl;
            // $("#wikiTitle").html(selectedCountryName);
            $("#wikiCountrySummary").html(wikiSummary);
            $("#wikiCountryLink").attr("href", `https://${wikiUrl}`);
            $("#wikiCountryName").html(selectedCountryName);
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
            "fa-brands fa-wikipedia-w fa-lg",
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
    try {
      const result = await $.ajax({
        url: "libs/php/getOpenExchangeRate.php",
        type: "POST",
        dataType: "json",
        data: { currencyCode: currencyCode },
      });
      if (result.status.name === "ok") {
        let currencyValue = result.data.rates[currencyCode];
        let roundedCurrencyValue = currencyValue.toFixed(2);
        let currentDate = new Date().toString();
        let realDate = currentDate.split("+")[0];
        // modal //
        $("#erCountry").html(selectedCountryName);
        $("#erValue").html(roundedCurrencyValue);
        $("#erCode").html(currencyCode);
        $("#erDate").html(realDate);
        // Easy Button //
        exchangeRateEasyButton = L.easyButton(
          "fa-solid fa-dollar-sign fa-lg",
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
      });
      if (result.status.name === "ok") {
        let flagData = $.grep(result.data, function (e) {
          console.log(e)
          return e.name.common === selectedCountryName || e.name.official === selectedCountryName 
        });
        console.log(flagData)
        let flagLink;
        if (flagData.length === 0) {
          flagLink = "libs/assets/imageNotFound.png" 
        } else {
          flagLink = flagData[0].flags.png;
        }
        console.log(flagLink);
        $("#flagTitle").html(selectedCountryName);
        $("#flagImg").attr("src", flagLink);

          // Easy Button //
        flagEasyButton = L.easyButton(
          "fa-solid fa-flag fa-lg",
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

  // ----------------- TIMEZONE DATA API CALL --------------------//

  async function getTimezoneData(geoNameLat, geoNameLng) {
    console.log(geoNameLat, geoNameLng);
    try {
      const result = await $.ajax({
        url: "libs/php/getTimezoneAPI.php",
        type: "POST",
        dataType: "json",
        data: { latitude: geoNameLat, longitude: geoNameLng },
      });
      if (result.status.name === "ok") {
        let tzData = result.data;
        console.log(tzData);
        let localTimeData = tzData.time;
        let localTime = localTimeData.split(" ")[1];
        let sunriseData = tzData.sunrise;
        let sunrise = sunriseData.split(" ")[1];
        let sunsetData = tzData.sunset;
        let sunset = sunsetData.split(" ")[1];
        let gmtOffset = tzData.gmtOffset;
        console.log(gmtOffset);

        $("#localTime").html(localTime);
        $("#sunrise").html(`Sunrise: ${sunrise}`);
        $("#sunset").html(`Sunset: ${sunset}`);
        $("#tzOffset").html(`Today, ${gmtOffset}HRS`);
        $("#tzCountry").html(selectedCountryName);

        // tzEasy Button //
        timezoneEasyButton = L.easyButton(
          "fa-solid fa-clock fa-lg",
          function (btn, map) {
            $("#tzModal").modal("show");
          }
        );
        timezoneEasyButton.addTo(map);
      } else {
        throw new Error("Failed to retrieve flag data.");
        // exchange rate data not found message to for HTML modal
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }









  


  // ------------------------- COUNTRY LIST CHANGE EVENT ----------------------- //

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
  let timezoneEasyButton;

  let selectedCountryCode;
  let selectedCountryName;
  let currencyCode;

  $("#selectCountry").on("change", async function () {
    selectedCountryCode = $(this).val();
    selectedCountryName = $("#selectCountry :selected").text();

    // --------- REMOVING OLD BUTTONS ----------------- //
    currentPolygonLayer ? map.removeLayer(currentPolygonLayer) : '';
    currentMarker ? map.removeLayer(currentMarker): null ;
    wikiEasyButton ? wikiEasyButton.removeFrom(map): null;
    countryBasicDataButton ? countryBasicDataButton.removeFrom(map): null;
    weatherEasyButton ? weatherEasyButton.removeFrom(map): null;
    exchangeRateEasyButton ? exchangeRateEasyButton.removeFrom(map): null;
    flagEasyButton ? flagEasyButton.removeFrom(map) : null;
    timezoneEasyButton ? timezoneEasyButton.removeFrom(map): null;


    // ------------ ADDING COUNTRY LAYER  ---------------//
    let selectedCountry = $.grep(countryData, function (e) {
      return e.countryName === selectedCountryName;
    });
    let selectedCountryCoords = selectedCountry[0].polygon[0];
    console.log(selectedCountryCoords);
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
    console.log(latLng); // Array of points fr broder

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
      const timezoneData = await getTimezoneData(geoNameLat, geoNameLng);
    } catch (error) {
      console.error(error);
    }
    
  });
});
