let apiKey = "0779e5f00c3333790a98dafe71d6c344";
let currentCity;
const today = moment();
let forecastDate;

function buildQueryURL() {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

    let queryCity = $("#city-input").val();

    return queryURL + queryCity + "&appid=" + apiKey;

 
}

function buildUVQueryURL(longitude, latitude) {
    let queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=";

   

    return queryURL + apiKey + "&lat=" + latitude + "&lon=" + longitude;


}

function buildForecastURL(cityName) {
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=";
    return queryURL + cityName + "&appid=" + apiKey;
}

function getImageIconData(data, element) {
    switch (data) {
        case "Clouds":
            
            $(element).attr("src", "./images/clouds.png");
            break;
        case "Rain":
            
            $(element).attr("src", "./images/rain.png");
            break;
        case "Clear":
            
            $(element).attr("src", "./images/sunny.png");
            break;
        default:
 
            break;
    }
}

function updatePage(weatherData) {

    let temp = (parseInt(weatherData.main.temp) - 273.15).toFixed(1);
  
    getImageIconData(weatherData.weather[0].main, "#weather-pic");

    // switch (weatherData.weather[0].main) {
    //     case "Clouds":
            
    //         $("#weather-pic").attr("src", "./images/clouds.png");
    //         break;
    //     case "Rain":
            
    //         $("#weather-pic").attr("src", "./images/rain.png");
    //         break;
    //     case "Clear":
            
    //         $("#weather-pic").attr("src", "./images/sunny.png");
    //         break;
    //     default:
 
    //         break;
    // }


    $("#city-name").text(weatherData.name + " (" + (today.format('DD-MM-YYYY')) + ")");
    //  $("#weather-pic").text(weatherData.weather.main);
    $("#current-temp").text("Temperature: " + temp + "°C");
    $("#current-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#current-wind").text("Wind Speed: " + weatherData.wind.speed + " meter/sec");

}

function buildForecast(forecastData) {
    let forecastArray = [];
    // collect the first 5 days forecast from the api response
    for (let i = 0; i < 5; i++) {
        forecastArray.push({
            dayNumber: i,
            weather: forecastData.list[i].weather[0].main,
            temp: "Temp: " + (parseInt(forecastData.list[i].main.temp) -273.15).toFixed(1) + "°C",
            humid: "Humidity: " + forecastData.list[i].main.humidity + "%"
        })
    }
    // add the forecast data to the html
    let forecasts = $(".forecast-card");
    // Get the list of elements to display date
    let dateEls = document.getElementsByClassName("date");
    // get the list of html elements to display temperature
    let tempEls = document.getElementsByClassName("temp");
    // get the list of html elements to display humidity
    let humEls = document.getElementsByClassName("humid");
    // Get the list of html elements to display the weather image
    let imageEls = document.getElementsByClassName("picture");

    

    for (let j = 0; j < 5; j++) {
        // get the date of the forecast day
        forecastDate = today.clone().add((j+1), 'days').format('DD-MM-YYYY');
        // update the text content of the html elements
        dateEls[j].textContent = forecastDate;
        tempEls[j].textContent = forecastArray[j].temp;
        humEls[j].textContent = forecastArray[j].humid;
// Call function to update the weather icon image
        getImageIconData(forecastArray[j].weather, ".icon-pic" + j);

    }
}



function getAJAXData() {
    currentCity = $("#city-input").val();
    // Build the query URL for the ajax request to the OpenWeather API
    let queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        updatePage(response);
        let longitude = response.coord.lon;
        let latitude = response.coord.lat;
        let currentUVQuery = buildUVQueryURL(longitude, latitude);

        // to get the UV Index
        $.ajax({
            url: currentUVQuery,
            method: "GET"
        }).then(response => {
            $("#currentUV").text("UV Index: " + response.value)
        
            // to get 5-day forecast
            let forecastQuery = buildForecastURL(currentCity);

            $.ajax({
                url: forecastQuery,
                method: "GET"
            }).then(buildForecast);

        });
    });
}

$("#run-search").on("click", function(event) {
    event.preventDefault();
    
    getAJAXData();

    

})