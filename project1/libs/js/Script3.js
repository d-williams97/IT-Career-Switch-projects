$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

let countryData;
let countryNames;
let countryCodes;
let defaultLat;
let defaultLong;
let isoCode;

let cityMarkers;
let cityData;

let airportMarkers;
let airportData;

let countryBorderLayer;
let geoJsonData;
let selectedCountryData;
let selectedCountryCode;
let selectedCountryName;

// ------------- SETTING UP MAP --------------- //

let tileLayer1 = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
);

let tileLayer2 = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

// -------------- INITIALISING MAP -------------- //

let map = L.map("map", {
  center: [0, 0],
  zoom: 1,
  layers: [tileLayer1],
});

// -------------- ADDING EASY BUTTONS ------------- //

let countryBasicDataButton = L.easyButton(
  "fa-solid fa-info fa-lg",
  function (btn, map) {
    $("#basicDataModal").modal("show");
  }
);
countryBasicDataButton.addTo(map);


let weatherEasyButton = L.easyButton(
  "fa-solid fa-cloud fa-lg",
  function (btn, map) {
    $("#weatherModal").modal("show");
  }
);
weatherEasyButton.addTo(map);


let wikiEasyButton = L.easyButton(
  "fa-brands fa-wikipedia-w fa-lg",
  function (btn, map) {
    $("#wikiModal").modal("show");
  }
);
wikiEasyButton.addTo(map);


let exchangeRateEasyButton = L.easyButton(
  "fa-solid fa-dollar-sign fa-lg",
  function (btn, map) {
    $("#erModal").modal("show");
  }
);
exchangeRateEasyButton.addTo(map);

let timezoneEasyButton = L.easyButton(
  "fa-solid fa-clock fa-lg",
  function (btn, map) {
    $("#tzModal").modal("show");
  }
);
timezoneEasyButton.addTo(map);


let newsEasyButton = L.easyButton(
  "fa-solid fa-newspaper fa-lg",
  function (btn, map) {
    $("#newsModal").modal("show");
  }
);
newsEasyButton.addTo(map);

// ------ ADD MARKERCLUSTERS & ICONS -------- //

airports = L.markerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
}).addTo(map);

cities = L.markerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
}).addTo(map);

airportIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-plane",
  iconColor: "black",
  markerColor: "white",
  shape: "square",
});

cityIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-city",
  markerColor: "green",
  shape: "square",
});

let overlays = {
  Cities: cities,
  Airports: airports,
};

let baseMaps = {
  "World Map": tileLayer1,
  Satellite: tileLayer2,
};

L.control.layers(baseMaps, overlays).addTo(map);


$(document).ready(function () {
  if (navigator.geolocation) {
    function showPosition(position) {
      defaultLat = position.coords.latitude;
      defaultLong = position.coords.longitude;
      changeSelectOption(defaultLat, defaultLong);
    }

    function geoError(err) {
      console.log(err.message);
      defaultLat = 0;
      defaultLong = 0;
      changeSelectOption(defaultLat, defaultLong);
    }

    navigator.geolocation.getCurrentPosition(showPosition, geoError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  // ------ GET COUNTRY CODE AND COUNTRY NAME DATA ------ //

  $.ajax({
    url: "libs/php/getLocalJson.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        countryData = result.data;

        // ---- CREATING COUNTRY HTML LIST ----- //
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
});



// --------------------------EVENT HANDLERS ------------------------------//


// ----- COUNTRY LIST CHANGE EVENT ----- //

$("#selectCountry").on("change", async function () {
  selectedCountryCode = $(this).val();
  selectedCountryName = $("#selectCountry :selected").text();

  // ----- REMOVING OLD MARKERS AND BORDER LAYER ------ //
  countryBorderLayer ? map.removeLayer(countryBorderLayer) : null;
  cityMarkers ? cities.clearLayers(cityMarkers) : null;
  airportMarkers ? airports.clearLayers(airportMarkers) : null;

  $.ajax({
    url: "libs/php/getLocalJson2.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        selectedCountryData = $.grep(result.data.features, function (e) {
          return e.properties.iso_a2 === selectedCountryCode;
        });
        geoJsonData = selectedCountryData[0];
        countryBorderLayer = L.geoJSON(geoJsonData, {
          style: {
            color: "red",
            weight: 2,
          },
        }).addTo(map);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // ------------- ASYNCH API CALLS ------------ //
  try {
    const geolocationData = await getGeolocationData(
      selectedCountryName,
      selectedCountryCode
    );
    const citiesData = await getCityData(selectedCountryCode, cityIcon);
    const airportData = await getAirportData(selectedCountryCode);
    const flagData = await getFlagData(selectedCountryName);
  } catch (error) {
    console.error(error);
  }
});



// -------- GEONAMES BASIC DATA API CALL ------//

$("#basicDataModal").on("show.bs.modal", async function () {
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
      currencyCode = countryBasicData.currencyCode;
      const countryBasicPopulation = parseFloat(countryBasicData.population);
      const countryBasicArea = parseFloat(countryBasicData.areaInSqKm);
      $("#basicCountryName").html(`Overview - ${selectedCountryName}`);
      $("#basicCapitalCity").html(countryBasicData.capital);
      $("#basicContinent").html(countryBasicData.continentName);
      $("#basicPopulation").html(
        countryBasicPopulation.toLocaleString("en-gb")
      );
      $("#basicArea").html(countryBasicArea.toLocaleString("en-gb"));
      $("#basicPreloader").addClass("fadeOut");
    } else {
      throw new Error("Failed to retrieve geonames basic data.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

$("#basicDataModal").on("hidden.bs.modal", async function () {
  $("#basicPreloader").removeClass("fadeOut");
});




// -------- WEATHER DATA API CALL --------//

let capitalCity;
$("#weatherModal").on("show.bs.modal", async function () {
  $.ajax({
    url: "libs/php/getCapitalCity.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: selectedCountryCode,
    },
  })
    .then(function (result1) {
      if (result1.status.code === "200") {
        capitalCity = result1.data.capitalCity;
        return $.ajax({
          url: "libs/php/getOpenWeather.php",
          type: "POST",
          dataType: "json",
          data: {
            city: capitalCity,
          },
        });
      } else {
        throw new Error("failed to retrieve capital city data");
      }
    })
    .then(function (result2) {
      if (result2.status.code === "200") {
        const weatherData = result2.data;
        let icon = weatherData.forecast[0].day.condition.icon;
        let icon1 = weatherData.forecast[1].day.condition.icon;
        let icon2 = weatherData.forecast[2].day.condition.icon;

        let day1Data = weatherData.forecast[1].date.toString();
        let day1Date = new Date(day1Data);
        let dayOfWeek1 = day1Date.toLocaleString("en-GB", {
          weekday: "short",
        });
        let dayOfMonth1 = day1Date.toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
        });

        let day2Data = weatherData.forecast[2].date.toString();
        let day2Date = new Date(day2Data);
        let dayOfWeek2 = day2Date.toLocaleString("en-US", {
          weekday: "short",
        });
        let dayOfMonth2 = day2Date.toLocaleString("en-US", {
          day: "numeric",
          month: "short",
        });

        let lastUpdated = weatherData.lastUpdate;
        let dateTime = new Date(lastUpdated);
        let hours = dateTime.getHours().toString().padStart(2, "0");
        let minutes = dateTime.getMinutes().toString().padStart(2, "0");
        let todayDateData = weatherData.forecast[1].date.toString();
        let todayDate = new Date(todayDateData);
        let todayDayOfMonth = todayDate.toLocaleString("en-US", {
          day: "numeric",
          month: "short",
        });

        $("#weatherTitle").html(
          `Weather - ${capitalCity} ,${selectedCountryName}`
        );
        $("#todayConditions").html(weatherData.forecast[0].day.condition.text);
        $("#todayIcon").attr("src", `https:${icon}`);
        $("#todayMaxTemp").html(weatherData.forecast[0].day.maxtemp_c);
        $("#todayMinTemp").html(weatherData.forecast[0].day.mintemp_c);
        $("#lastUpdated").html(`${hours}:${minutes}, ${todayDayOfMonth}`);

        $("#day1Date").html(`${dayOfWeek1} ${dayOfMonth1}`);
        $("#day1MaxTemp").html(weatherData.forecast[1].day.maxtemp_c);
        $("#day1MinTemp").html(weatherData.forecast[1].day.mintemp_c);
        $("#day1Icon").attr("src", `https:${icon1}`);

        $("#day2Date").html(`${dayOfWeek2} ${dayOfMonth2}`);
        $("#day2MaxTemp").html(weatherData.forecast[2].day.maxtemp_c);
        $("#day2MinTemp").html(weatherData.forecast[2].day.mintemp_c);
        $("#day2Icon").attr("src", `https:${icon2}`);

        $("#weatherPreloader").addClass("fadeOut");
      } else {
        throw new Error("failed to retrieve weather data");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

$("#weatherModal").on("show.bs.modal", async function () {
  $("#weatherPreloader").removeClass("fadeOut");
});


// -------- WIKI DATA API CALL -----------//

$("#wikiModal").on("show.bs.modal", async function () {
  try {
    const result = await $.ajax({
      url: "libs/php/getWikiAPI.php",
      type: "POST",
      dataType: "json",
      data: { country: selectedCountryName },
    });

    if (result.status.name === "ok") {
      if (result.status === undefined) {
      } else {
        const resultsData = result.data.geonames;
        let wikiObj = $.grep(resultsData, function (obj) {
          return obj.title === selectedCountryName;
        });
        if (wikiObj.length === 0) {
          wikiObj = $.grep(resultsData, function (obj) {
            return obj;
          });
        }
        const wikiData = wikiObj[0];
        if (wikiData === undefined) {
          console.log("country data not found");
        } else {
          let wikiSummaryText = wikiData.summary;
          wikiUrl = wikiData.wikipediaUrl;
          wikiSummary = wikiSummaryText.slice(0, -5);

          $("#wikiCountrySummary").html(wikiSummary);
          $("#wikiCountryLink").attr("href", `https://${wikiUrl}`);
          $("#wikiTitle").html(`Wiki Summary - ${selectedCountryName} `);
        }
        if (!wikiData.thumbnailImg) {
          console.log("image not found");
          wikiImg = "libs/assets/imageNotFound.png";
          $("#wikiImg").attr("src", wikiImg);
        } else {
          wikiImg = wikiData.thumbnailImg;
          $("#wikiImg").attr("src", wikiImg);
        }
        $("#wikiPreloader").addClass("fadeOut");
      }
    } else {
      throw new Error("Failed to retrieve wiki data.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

$("#wikiModal").on("hidden.bs.modal", async function () {
  $("#wikiPreloader").removeClass("fadeOut");
});


// -------EXCHANGE RATE DATA API CALL------ //
let currencyName;
let currencyCode;
let currencySymbol;
let fromVal;
let currencyValue;
let roundedCurrencyValue;
let erResult;
$("#erModal").on("show.bs.modal", function () {
  $.ajax({
    url: "libs/php/getCurrencyData.php",
    type: "POST",
    dataType: "json",
    data: { countryCode: selectedCountryCode },
  })
    .then(function (result1) {
      if (result1.status.code === "200") {
        let currencyObj = result1.data;
        currencyCode = Object.keys(currencyObj)[0];
        currencyName = currencyObj[currencyCode].name;
        currencySymbol = currencyObj[currencyCode].symbol;
      } else {
        throw new Error("failed to get currencyData");
      }
      return $.ajax({
        url: "libs/php/getOpenExchangeRate.php",
        type: "POST",
        dataType: "json",
        data: {
          currencyCode,
        },
      }).then(function (result2) {
        if (result2.status.name === "ok") {
          currencyValue = result2.data;
          roundedCurrencyValue = currencyValue.toFixed(2);
          let currentDate = new Date().toString();
          // let realDate = currentDate.split("+")[0];
          fromVal = $("#fromValue").val();
          erResult = fromVal * roundedCurrencyValue;

          // modal //
          $("#erTitle").html(`Exchange Rate - ${selectedCountryName}`);
          $("#exchangeRate").attr("value", currencyName);
          $("#erResult").attr("value", `${currencySymbol} ${erResult}`);

          $("#erPreloader").addClass("fadeOut");
        } else {
          throw new Error("Failed to retrieve exchange rate data.");
          // exchange rate data not found message to for HTML modal
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

$("#erModal").on("hidden.bs.modal", function () {
  $("#erPreloader").removeClass("fadeOut");
});

let calcResult = () => {
  let calcVal = $("#fromValue").val() * roundedCurrencyValue;
  $("#erResult").attr(
    "value",
    `${currencySymbol} ${numeral(calcVal).format("0.00")}`
  );
};

$("#fromValue").on("change", function () {
  calcResult();
});
$("#fromValue").on("keyup", function () {
  calcResult();
});


// ------------- TIMEZONE DATA API CALL ----------- //
let tzCapitalCity;
$("#tzModal").on("show.bs.modal", function () {
  $.ajax({
    url: "libs/php/getCapitalCity.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: selectedCountryCode,
    },
  }).then(function (result1) {
    let tzCapitalLat = result1.data.lat;
    let tzCapitalLng = result1.data.lng;
    tzCapitalCity = result1.data.capitalCity;
    return $.ajax({
      url: "libs/php/getTimezoneAPI.php",
      type: "POST",
      dataType: "json",
      data: { latitude: tzCapitalLat, longitude: tzCapitalLng },
    })
      .then(function (result2) {
        if (result2.status.name === "ok") {
          let tzData = result2.data;
          let localTimeData = tzData.time;
          let localTime = localTimeData.split(" ")[1];
          let sunriseData = tzData.sunrise;
          let sunrise = sunriseData.split(" ")[1];
          let sunsetData = tzData.sunset;
          let sunset = sunsetData.split(" ")[1];
          let gmtOffset = tzData.gmtOffset;

          $("#localTime").html(localTime);
          $("#sunrise").html(`Sunrise: ${sunrise}`);
          $("#sunset").html(`Sunset: ${sunset}`);
          $("#tzOffset").html(`Today, ${gmtOffset}HRS (GMT)`);
          $("#tzCity").html(tzCapitalCity);
          $("#tzTitle").html(`World Clock - ${selectedCountryName}`);
        } else {
          throw new Error("Failed to retrieve flag data.");
        }
        $("#tzPreloader").addClass("fadeOut");
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});

$("#tzModal").on("hidden.bs.modal", function () {
  $("#tzPreloader").removeClass("fadeOut");
});


// --------- NEWS DATA API CALL -----------//

let newsData;
$("#newsModal").on("show.bs.modal", function () {
  $.ajax({
    url: "libs/php/getNews.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: selectedCountryCode,
    },
    headers: {
      "x-api-key": "GxBBgzWMWCQ_LBhogEh9_zk2s4bApMmNQokib4EoA-g",
    },
    success: function (result) {
      if (result.status.code === "200") {
        console.log(result);
        newsData = result.data.articles;
        console.log(newsData);

        let newsModalData = $("#newsModalData");
        $("#newsTitle").html(`${selectedCountryName} Breaking News`);

        if (newsData !== undefined) {
          for (let i = 0; i < newsData.length; i++) {
            let data = newsData[i];
            let table = $("<table>").addClass("table table-borderless");

            let row1 = $("<tr>");
            row1.append(
              $("<td>")
                .attr("rowspan", "2")
                .width("50%")
                .append(
                  $("<img>")
                    .addClass("img-fluid rounded")
                    .attr("src", data.media)
                    .attr("alt", `news image ${i}`)
                    .attr("title", `news article ${i}`)
                )
            );
            row1.append(
              $("<td>").append(
                $("<a>")
                  .attr("href", data.link)
                  .addClass("fw-bold fs-6 text-black")
                  .text(data.title)
              )
            );
            table.append(row1);

            let row2 = $("<tr>");
            row2
              .append($("<td>").addClass("align-bottom pb-0"))
              .append(
                $("<p>").addClass("fw-light fs-6 mb-1").text(data.rights)
              );
            table.append(row2);

            newsModalData.append(table);

            $("#newsPreloader").addClass("fadeOut");
            if (i < newsData.length - 1) {
              newsModalData.append($("<hr>"));
            }
          }
        } else {
          newsModalData.append(
            $("<p>").addClass("newsError").text("news data not found")
          );
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

$("#newsModal").on("hidden.bs.modal", function () {
  $(".table").remove();
  $(".newsError").remove();
  $("#newsPreloader").removeClass("fadeOut");
});


// ----------------------------- FUNCTIONS --------------------------//

// ----- ADDING LAYERS TO MAP ----- //

async function changeSelectOption(lat, long) {
  try {
    const result = await $.ajax({
      url: "libs/php/getSelectOption.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: lat,
        lng: long,
      },
    });

    if (result.status.name === "ok") {
      if (result.data.countryCode) {
        isoCode = result.data.countryCode;
        $("#selectCountry").val(isoCode).change();
      } else {
        $("#selectCountry").val("AF").change();
      }
    } else {
      throw new Error("Failed to get ISO code.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ------ CITY DATA FOR MARKERS ------- //
async function getCityData(selectedCountryCode, cityIcon) {
  try {
    const result = await $.ajax({
      url: "libs/php/getCities.php",
      type: "POST",
      dataType: "json",
      data: {
        countryCode: selectedCountryCode,
      },
    });
    if (result.status.code === "200") {
      cityData = result.data;
      cityData.forEach((city) => {
        L.marker([city.lat, city.lng], {
          icon: cityIcon,
        })
          .bindTooltip(
            `<div class='col text-center'><strong>${
              city.city
            } <strong/><br><i>${numeral(city.population).format(
              "0,0"
            )}<i/><div/>`,
            { direction: "top", sticky: true }
          )
          .addTo(cities);
      });
      cityMarkers = cities.getLayers();
    } else {
      console.log("error");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// ------ AIRPORT DATA FOR MARKERS ------- //

async function getAirportData(selectedCountryCode) {
  try {
    const result = await $.ajax({
      url: "libs/php/getAirports.php",
      type: "POST",
      dataType: "json",
      data: {
        countryCode: selectedCountryCode,
      },
    });
    if (result.status.code === "200") {
      airportData = result.data;
      airportData.forEach((airport) => {
        L.marker([airport.lat, airport.lng], {
          icon: airportIcon,
        })
          .bindTooltip(
            `<div class='col text-center'><strong>${airport.name} <strong/><div/>`,
            { direction: "top", sticky: true }
          )
          .addTo(airports);
      });
      airportMarkers = airports.getLayers();
    } else {
      console.log("error");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// ---- COUNTRY LAYER DATA ----- //

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
      const countryBoundsObj = result.data.results[0].bounds;
      const countryBoundsData = Object.values(countryBoundsObj);
      map.fitBounds(countryBoundsData);
    } else {
      throw new Error("Failed to retrieve geolocation data.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// --------- FLAG DATA API CALL --------//

async function getFlagData(selectedCountryName) {
  try {
    const result = await $.ajax({
      url: "libs/php/getFlagAPI.php",
      type: "POST",
      dataType: "json",
      data: { countryName: selectedCountryName },
    });
    if (result.status.name === "ok") {
      let flagData = $.grep(result.data, function (e) {
        return (
          e.name.common === selectedCountryName ||
          e.name.official === selectedCountryName
        );
      });
      let flagLink;
      if (flagData.length === 0) {
        flagLink = "libs/assets/imageNotFound.png";
      } else {
        flagLink = flagData[0].flags.png;
      }
      $("#flagImg").attr("src", flagLink);
    } else {
      throw new Error("Failed to retrieve flag data.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
