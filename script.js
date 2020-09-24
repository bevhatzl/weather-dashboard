$(document).ready(function () {

    let apiKey = "0779e5f00c3333790a98dafe71d6c344";
    let currentCity;
    const today = moment();
    let forecastDate;
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    let savedCities = [];
    const savedCityLocalStorage = "cities";
    let storedCurrCity = JSON.parse(localStorage.getItem("city"));
    const currCityLocalStorage = "city";

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
        for (i = 0; i <= savedCities.length - 1; i++) {
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
        let queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?appid=";
        return queryURL + apiKey + "&lat=" + latitude + "&lon=" + longitude;
    }

    // To get the query URL for the 5 day forecast
    function buildForecastURL(cityName) {
        let queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=";
        return queryURL + cityName + "&appid=" + apiKey;
    }

    // To decide which weather image to display according to the data from api
    function getImageIconData(data, element) {
        $(element).attr("src", "https://openweathermap.org/img/wn/" + data + "@2x.png");
    }

    // Displaying the current weather 
    function updatePage(weatherData) {
        // Display the hidden elements
        $(".wrapper-forecast").css("visibility", "visible");
        $(".five-day").css("visibility", "visible");
        $(".col-md-9").css("visibility", "visible");
        // Convert from Kelvin to Celsius
        let temp = (parseInt(Math.round(weatherData.main.temp - 273.15)));
        // Call to function to decide which weather image to display
        getImageIconData(weatherData.weather[0].icon, "#weather-pic");
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
                weather: forecastData.list[i].weather[0].icon,
                temp: "Temp: " + (parseInt(Math.round(forecastData.list[i].main.temp - 273.15))) + "°C",
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
            forecastDate = today.clone().add((j + 1), 'days').format('DD-MM-YYYY');
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

    // Change the background of the UV Index element according to the value
    function getUVColor(UVValue) {
        if (UVValue <= 2) {
            $("#currentUV").css('background-color', '#33cc33');
        } else if (UVValue <= 5) {
            $("#currentUV").css('background-color', '#ffff00');
        } else if (UVValue <= 7) {
            $("#currentUV").css('background-color', '#ff9900');
        } else if (UVValue <= 10) {
            $("#currentUV").css('background-color', '#ff0000');
        } else if (UVValue > 10) {
            $("#currentUV").css('background-color', '#b300b3');
        }
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
            method: "GET",
            success: function (response) {
                updatePage(response);
                // Latitude and Longitude needed to build the ajax request to get UV Index
                longitude = response.coord.lon;
                latitude = response.coord.lat;
                currentUVQuery = buildUVQueryURL(longitude, latitude);
                // Call to function to check if city is already in list of saved cities
                let IsCityInList = isCityInList(city);
                // Add the city to the list of saved cities if not already
                if (!IsCityInList) {
                    savedCities.push(city);
                    createCityEl(city);
                }
                // Save the current city in local storage, this will be displayed upon page refresh
                localStorage.setItem(currCityLocalStorage, JSON.stringify((city)));
                // Save the city in local storage for the saved cities list
                localStorage.setItem(savedCityLocalStorage, JSON.stringify((savedCities)));
                // to get the UV Index
                $.ajax({
                    url: currentUVQuery,
                    method: "GET"
                }).then(response => {
                    $("#currentUV").text("UV Index: " + response.value);
                    let UVNum = Number(response.value);
                    getUVColor(UVNum);
                });
                // To get the 5 day forecast data   
                $.ajax({
                    url: forecastQuery,
                    method: "GET"
                }).then(buildForecast);

            },
            error: function () {
                alert("Sorry, that city was not found.");
            }
        });
    }

    function isCityInList(cityName) {
        return savedCities.includes(cityName);
    }

    // When search button is clicked...
    $("#run-search").on("click", function (event) {
        event.preventDefault();
        let inputCity = $("#city-input").val();
        // Start the request to the api
        getAJAXData(inputCity);
    })

    // When a city in the list is clicked...
    $(".list-group").on("click", function (event) {
        event.preventDefault();
        // Update the current city variable
        currentCity = $(event.target)[0].textContent;
        // Start the request to the api
        getAJAXData(currentCity);
    })

})