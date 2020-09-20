$(document).ready(function() {

    let apiKey = "0779e5f00c3333790a98dafe71d6c344";
    let currentCity;
    const today = moment();
    let forecastDate;
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    let savedCities = [];
    const savedCityLocalStorage = "cities";
    let storedCurrCity = JSON.parse(localStorage.getItem("city"));
    const currCityLocalStorage = "city"

    // To get stored city and city list when page refreshes
    if (storedCities) {
        savedCities = storedCities;
        // To display the stored cities in a list
        buildCityList();
        // To make the Ajax requests for the current city
        getAJAXData(storedCurrCity);
    }

    // Loop through the list of stored cities and create li elements for each
    function buildCityList() {
        for (i = 0; i < savedCities.length; i++) {
            let newLiEl = document.createElement("li");
            newLiEl.textContent = savedCities[i];
            $(newLiEl).attr("class", "city-list");
            $(".list-group").prepend(newLiEl);
        }
    }

    // To get the query URL for the city's current weather stats
    function buildQueryURL(city) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
        return queryURL + city + "&appid=" + apiKey;
    }

    // To get the query URL for the city's current UV Index
    function buildUVQueryURL(longitude, latitude) {
        let queryURL = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/uvi?appid=";
        return queryURL + apiKey + "&lat=" + latitude + "&lon=" + longitude;
    }

    // To get the query URL for the 5 day forecast
    function buildForecastURL(cityName) {
        let queryURL = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/forecast?q=";
        return queryURL + cityName + "&appid=" + apiKey;
    }

    // To decide which weather image to display according to the data from api
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
                $(element).attr("src", "");
                break;
        }
    }

    // Displaying the current weather 
    function updatePage(weatherData) {
        // Convert from Kelvin to Celsius
        // let temp = (parseInt(weatherData.main.temp) - 273.15).toFixed(0);
        let temp = (parseInt(Math.round(weatherData.main.temp - 273.15)));
        // Call to function to decide which weather image to display
        getImageIconData(weatherData.weather[0].main, "#weather-pic");
        // Updating the weather stats in the HTML
        $("#city-name").text(weatherData.name + " (" + (today.format('DD-MM-YYYY')) + ")");
        $("#current-temp").text("Temperature: " + temp + "°C");
        $("#current-humid").text("Humidity: " + weatherData.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weatherData.wind.speed + " meter/sec");
    }

    function buildForecast(forecastData) {
        let forecastArray = [];
        // collect the first 5 days forecast from the api response
        for (let i = 0; i < 5; i++) {
            // Setting up the array of objects
            forecastArray.push({
                dayNumber: i,
                weather: forecastData.list[i].weather[0].main,
                temp: "Temp: " + (parseInt(Math.round(forecastData.list[i].main.temp -273.15))) + "°C",
                humid: "Humidity: " + forecastData.list[i].main.humidity + "%"
            })
        } 
        // Get the list of elements to display date
        let dateEls = document.getElementsByClassName("date");
        // get the list of html elements to display temperature
        let tempEls = document.getElementsByClassName("temp");
        // get the list of html elements to display humidity
        let humEls = document.getElementsByClassName("humid");

        // Loop through the 5 day forcast
        for (let j = 0; j < 5; j++) {
            // Get the date of the forecast day
            forecastDate = today.clone().add((j+1), 'days').format('DD-MM-YYYY');
            // Update the text content of the html elements which are in a list
            dateEls[j].textContent = forecastDate;
            tempEls[j].textContent = forecastArray[j].temp;
            humEls[j].textContent = forecastArray[j].humid;
            // Call function to update the weather icon image
            getImageIconData(forecastArray[j].weather, ".icon-pic" + j);
        }
    }

    // Create and add a list item for the current city
    function createCityEl(city) {
        let newLiEl = document.createElement("li");
        newLiEl.textContent = city;
        $(newLiEl).attr("class", "city-list");
        $(".list-group").prepend(newLiEl);
    }

    function getAJAXData(city) {    
        // Build the query URL for the ajax request to the OpenWeather API for current weather
        let queryURL = buildQueryURL(city);
        // to get 5-day forecast
        let forecastQuery = buildForecastURL(city);
        let longitude;
        let latitude;
        let currentUVQuery;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            updatePage(response);
            // Latitude and Longitude needed to build the ajax request to get UV Index
            longitude = response.coord.lon;
            latitude = response.coord.lat;
            currentUVQuery = buildUVQueryURL(longitude, latitude);
            getUVData(currentUVQuery);
        });
        console.log(currentUVQuery);
        
        // to get the UV Index
        $.ajax({
            url: currentUVQuery,
            method: "GET"
        }).then(response => {
            console.log(response);
            $("#currentUV").text("UV Index: " + response.value);        
        });
                
        $.ajax({
            url: forecastQuery,
            method: "GET"
        }).then(buildForecast);            
    }

    // When search button is clicked...
    $("#run-search").on("click", function(event) {
        event.preventDefault();
        currentCity = $("#city-input").val();
        // Add the city to the list of saved cities
        savedCities.push(currentCity);
        createCityEl(currentCity);
        // Start the request to the api
        getAJAXData(currentCity);
        // Save the city in local storage for the saved cities list
        localStorage.setItem(savedCityLocalStorage, JSON.stringify((savedCities)));
        // Save the current city in local storage, this will be displayed upon page refresh
        localStorage.setItem(currCityLocalStorage, JSON.stringify((currentCity)));
    })

    // When a city in the list is clicked...
    $(".list-group").on("click", function(event) {
        event.preventDefault();
        // Update the current city variable
        currentCity = $(event.target)[0].textContent;
        // Start the request to the api
        getAJAXData(currentCity);
        // Save the current city in local storage, this will be displayed upon page refresh
        localStorage.setItem(currCityLocalStorage, JSON.stringify((currentCity)));
    })

})