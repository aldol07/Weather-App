const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const currentTemp = document.getElementById("currentTemp");
const maxTemp = document.getElementById("maxTemp");
const minTemp = document.getElementById("minTemp");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const localTime = document.getElementById("localTime");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const forecastCards = document.getElementById("forecastCards");

const getWeatherData = async (city) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found!");
      return;
    }

    const { latitude, longitude, timezone, name } = geoData.results[0];
    cityName.innerText = name;

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,weathercode,windspeed_10m_max&timezone=${timezone}`);
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;
    currentTemp.innerText = current.temperature;
    windSpeed.innerText = current.windspeed;
    localTime.innerText = current.time;

    
    weatherCondition.innerText = getWeatherDescription(current.weathercode);
    weatherIcon.src = getWeatherIcon(current.weathercode);

    maxTemp.innerText = weatherData.daily.temperature_2m_max[0];
    minTemp.innerText = weatherData.daily.temperature_2m_min[0];
    humidity.innerText = "--";
    forecastCards.innerHTML = "";
    for (let i = 1; i < 4; i++) {
      const date = weatherData.daily.time[i];
      const max = weatherData.daily.temperature_2m_max[i];
      const min = weatherData.daily.temperature_2m_min[i];
      const code = weatherData.daily.weathercode[i];
      forecastCards.innerHTML += `
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3">
            <h5>${date}</h5>
            <img src="${getWeatherIcon(code)}" class="weather-icon mb-2" alt="icon">
            <p>${getWeatherDescription(code)}</p>
            <p><strong>${max}°C</strong> / ${min}°C</p>
          </div>
        </div>
      `;
    }

  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

const getWeatherDescription = (code) => {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
    96: "Thunderstorm with hail"
  };
  return map[code] || "Unknown";
};

const getWeatherIcon = (code) => {
  if (code >= 0 && code <= 3) return "https://img.icons8.com/color/96/000000/sun.png";
  if (code === 45 || code === 48) return "https://img.icons8.com/color/96/000000/fog-day.png";
  if (code >= 51 && code <= 55) return "https://img.icons8.com/color/96/000000/light-rain-2.png";
  if (code >= 61 && code <= 65) return "https://img.icons8.com/color/96/000000/heavy-rain.png";
  if (code >= 71 && code <= 75) return "https://img.icons8.com/color/96/000000/snow.png";
  if (code >= 95) return "https://img.icons8.com/color/96/000000/storm.png";
  return "https://img.icons8.com/color/96/000000/weather.png";
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city !== "") getWeatherData(city);
});
getWeatherData("Prayagraj");
