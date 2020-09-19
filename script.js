let apiKey = "0779e5f00c3333790a98dafe71d6c344";
let cityName;



function buildQueryURL() {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

    let queryCity = $("#city-input").val();

    return queryURL + queryCity + "&appid=" + apiKey;

    // "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
}

function buildUVQueryURL(longitude, latitude) {
    let queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=";

   

    return queryURL + apiKey + "&lat=" + latitude + "&lon=" + longitude;

    // "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
}

function updatePage(weatherData) {
    console.log(weatherData);
    let temp = (parseInt(weatherData.main.temp) - 273.15).toFixed(1);
    console.log(temp);


    $("#city-name").text(weatherData.name);
    console.log(temp);
    $("#current-temp").text("Temperature: " + temp + "°C");
    $("#current-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#current-wind").text("Wind Speed: " + weatherData.wind.speed + " meter/sec");
    // $("#currentUV").val()
}


$("#run-search").on("click", function(event) {
    event.preventDefault();
  
    
    // Build the query URL for the ajax request to the OpenWeather API
    let queryURL = buildQueryURL();
  
     console.log(queryURL);
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
   
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        updatePage(response);
        console.log(response.coord.lon);
        let longitude = response.coord.lon;
        let latitude = response.coord.lat;

        let currentUVQuery = buildUVQueryURL(longitude, latitude);

                // to get the UV Index
     $.ajax({
        url: currentUVQuery,
         method: "GET"
       }).then(response => {$("#currentUV").text("UV Index: " + response.value)});
   
    });


    

})