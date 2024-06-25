// Strict Mode To correct Bad JS behaviour
"use strict";

// Declaring Variables
let response = [];
let latitude;
let longitude;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "Febraury",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// DOM Manuplation
const searchInput = document.getElementById("search");
const findMe = document.getElementById("findMe");
const currentDegree = document.getElementById("degree");
const currentWeatherStatus = document.getElementById("weatherStatus");
const dayWeatherStatus1 = document.getElementById("dayWeatherStatus1");
const dayWeatherStatus2 = document.getElementById("dayWeatherStatus2");
const currentImageStatus = document.getElementById("imageStatus");
const currentLocation = document.querySelector(".location");
const sunRise1 = document.querySelector("#sunrise1");
const sunRise2 = document.querySelector("#sunrise2");
const sunSet1 = document.querySelector("#sunset1");
const sunSet2 = document.querySelector("#sunset2");
const umbrella = document.getElementById('umbrella');
const wind = document.getElementById('wind');
const compass = document.getElementById('compass');

// Check You Have Location Services
if (navigator.geolocation) {
  getYourLocation();
} else {

}


document.addEventListener("DOMContentLoaded", async () => {
  // Load Alexandria till the user gives GeoAPI the permission
  weatherAPIByRequest(
    latitude =39.24,
    longitude = -76.85
  )
});

// Api request function
async function weatherAPIByRequest(
  latitude,
  longitude,
  requiredData = "forecast"
) {
  const getWeatherData = await fetch(
    `https://api.weatherapi.com/v1/${requiredData}.json?key=7d77b96c972b4d119a3151101212704&q=${latitude},${longitude}&days=3`
  );
  response = await getWeatherData.json();
  displayForecast();
}

async function weatherAPIBySearch(search) {
  const getWeatherData = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=7d77b96c972b4d119a3151101212704&q=${search}`
  );
  response = await getWeatherData.json();
  displaySearchResults();
}

// Declaring Functions
function displayForecast() {
  const time = new Date(response.location.localtime);
  const nextTime = new Date(response.forecast.forecastday[1].date);
  const followingTime = new Date(response.forecast.forecastday[2].date);
  const currentDay = days[time.getDay()];
  let currentHour = time.getHours();
  const currentMinutes = time.getMinutes();
  let timePmOrAm;
  if (currentHour > 12) {
    timePmOrAm = "PM";
    currentHour = currentHour - 12;
  } else {
    timePmOrAm = "AM";
  }
  const nextDay = days[nextTime.getDay()];
  const followingDay = days[followingTime.getDay()];
  const dayNumber = time.getDate();
  const monthName = months[time.getMonth()];
  document.getElementById("dayName").innerHTML = currentDay;
  document.getElementById("hourDisplay").innerHTML = `${currentHour}:${currentMinutes} ${timePmOrAm}`;
  document.getElementById("dayNumber").innerHTML = dayNumber;
  document.getElementById("monthName").innerHTML = monthName;
  document.getElementById("dayName1").innerHTML = nextDay;
  document.getElementById("dayName2").innerHTML = followingDay;
  document.getElementById("region").innerHTML = response.location.region;
  currentDegree.innerHTML = response.current.temp_c;
  currentWeatherStatus.innerHTML = response.current.condition.text;
  currentImageStatus.src = response.current.condition.icon;
  dayWeatherStatus1.innerHTML = response.forecast.forecastday[1].day.condition.text;
  dayWeatherStatus2.innerHTML = response.forecast.forecastday[2].day.condition.text;
  sunRise1.innerHTML = response.forecast.forecastday[1].day.mintemp_c;
  sunRise2.innerHTML = response.forecast.forecastday[2].day.mintemp_c;
  dayWeatherStatus2.innerHTML = response.forecast.forecastday[2].day.condition.text;
  sunSet1.innerHTML = response.forecast.forecastday[1].day.maxtemp_c;
  sunSet2.innerHTML = response.forecast.forecastday[2].day.maxtemp_c;

  umbrella.innerHTML = response.current.feelslike_c;
  wind.innerHTML = response.current.wind_kph;
  compass.innerHTML = response.current.wind_dir;
}

function getYourLocation() {
  navigator.geolocation.getCurrentPosition(
    function (e) {
      latitude = e.coords.latitude;
      longitude = e.coords.longitude;
      weatherAPIByRequest(latitude, longitude);
    }
  );
}

function displaySearchResults() {
  let cartoona = "";
  for (let i = 0; i < response.length; i++) {
    cartoona += `<div onClick="getSearchData(${response[i].lat}, ${response[i].lon}, this.innerHTML)" class="p-2 search-item">${response[i].name}, ${response[i].country}</div>`;
  }
  document.querySelector(".searchResults").innerHTML = cartoona;
}

function getSearchData(lat, long, text) {
  document
    .querySelector(".searchResults")
    .classList.replace("d-block", "d-none");
  searchInput.value = text;
  latitude = lat;
  longitude = long;
  weatherAPIByRequest(lat, long);
}

// Events

searchInput.addEventListener("keyup", function () {
  document
    .querySelector(".searchResults")
    .classList.replace("d-none", "d-block");
  weatherAPIBySearch(searchInput.value);
  displaySearchResults();
});

findMe.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(
    async function (e) {
      latitude = e.coords.latitude;
      longitude = e.coords.longitude;
      await weatherAPIByRequest(latitude, longitude);
      searchInput.value = `${response.location.region}, ${response.location.country}`;
    }
  );
});