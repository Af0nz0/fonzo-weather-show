//html elements
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const currentWeatherData = document.getElementById("currentWeatherData");
const forecastData = document.getElementById("forecastData");
const historyList = document.getElementById("historyList");

//api key
const API_KEY = "0a9839b78134ce5ae2e11705e9f69cd9";
//submission
searchForm.addEventListener("submit", handleFormSubmit);
//history
historyList.addEventListener("click", handleHistoryClick);

//function submission
function handleFormSubmit(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
  //weather data
    fetchWeatherData(city);
//forcast
    fetchForecastData(city);
//save history
    saveSearchHistory(city);
    clearInput();
  }
}


function handleHistoryClick(event) {
  const listItem = event.target.closest("li");
  if (listItem) {
    const city = listItem.textContent;
    fetchWeatherData(city);
    fetchForecastData(city);
  }
}

function fetchWeatherData(city) {
  const unit = getSelectedUnit();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to fetch weather data.");
      }
    })
    .then((data) => displayCurrentWeather(data))
    .catch((error) => console.error(error));
}

function fetchForecastData(city) {
  const unit = getSelectedUnit();
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to fetch forecast data.");
      }
    })
    .then((data) => displayForecast(data))
    .catch((error) => console.error(error));
}

function displayCurrentWeather(data) {
  currentWeatherData.innerHTML = `
    <div class="weather-card">
      <h3>${data.name}</h3>
      <p>Date: ${getDate()}</p>
      <p>Temperature: ${data.main.temp} &deg;${getTemperatureUnit()}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} ${getSpeedUnit()}</p>
    </div>
  `;
}

function displayForecast(data) {
  const forecastItems = data.list.slice(0, 5).map((item) => {
    return `
      <div class="weather-card">
        <h3>${getDate(item.dt)}</h3>
        <p>Temperature: ${item.main.temp} &deg;${getTemperatureUnit()}</p>
        <p>Humidity: ${item.main.humidity}%</p>
        <p>Wind Speed: ${item.wind.speed} ${getSpeedUnit()}</p>
      </div>
    `;
  });

  forecastData.innerHTML = forecastItems.join("");
}

function saveSearchHistory(city) {
  const listItem = document.createElement("li");
  listItem.textContent = city;
  historyList.prepend(listItem);
}

function clearInput() {
  cityInput.value = "";
}

function getDate(timestamp = null) {
  const date = timestamp ? new Date(timestamp * 1000) : new Date();
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

//temp unit
function getSelectedUnit() {
  return document.querySelector('input[name="unit"]:checked').value;
}

function getTemperatureUnit() {
  const unit = getSelectedUnit();
  return unit === "metric" ? "C" : "F";
}

function getSpeedUnit() {
  const unit = getSelectedUnit();
  return unit === "metric" ? "m/s" : "mph";
}
