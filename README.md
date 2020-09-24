# weather-dashboard
This is a weather dashboard using the OpenWeather api and made in HTML, CSS and Javascript. The Moment.js library and jQuery were also used. 

<p>Find the deployed project here: (https://bevhatzl.github.io/weather-dashboard/)</p>

## Instructions
<p>Initial display will have no data displayed. User can enter a city name and click the search icon. The current weather for the city will be displayed in the top while the 5 day forecast will be displayed in the 5 boxes at the bottom.</p>
<p>An icon displaying the weather for that date will be displayed, the icon will also distunguish between day and night time.</p>
<br>
<p>The UV Index is also displayed for the current day and is color coded based on the value received:</p>
<table style="width:100%">
    <tr>
        <th>Colour</th>
        <th>UV Index Range</th>
        <th>UV Index Description</th>
    </tr>
    <tr>
        <td>Green</td>
        <td>0 to 2</td>
        <td>Low</td>
    </tr>
    <tr>
        <td>Yellow</td>
        <td>3 to 5</td>
        <td>Moderate</td>
    </tr>
    <tr>
        <td>Orange</td>
        <td>6 to 7</td>
        <td>High</td>
    </tr>
        <tr>
        <td>Red</td>
        <td>8 to 10</td>
        <td>Very High</td>
    </tr>
        <tr>
        <td>Violet</td>
        <td>11+</td>
        <td>Extreme</td>
    </tr>
</table>
<br>

## Coming soon in future versions..
<ul>
    <li>The ability to search by city and country</li>
    <li>The ability to remove a saved city from the list</li>
    <li>Add a spinner while loading the 5 day forecast</li>
</ul>

## Built With

* [VScode] (https://code.visualstudio.com/) 

## With Help From
* [Postman] (http://postman.com/) 

#### Initial interface

![Screenshot of initial page of weather dashboard](/images/screen1.png)

#### Final Interface

![Screenshot of weather dashboard with weather data displayed](/images/screen2.png)

## Author
Beverley Hatzl 2020

