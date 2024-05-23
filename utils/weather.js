require('dotenv').config()

async function getGeocodeData(city) {
  const countryCode = 1;
  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city.replace(" ", "%20")},${countryCode}&limit=1&appid=${process.env.OPENWEATHER_KEY}`;

  const response = await fetch(geocodeURL);
  const json = await response.json();
  if (!response.ok || !json[0]) {
    console.log("server error: ", response);
    return {error: "Aucune ville avec ce nom trouvée."};
  }

  let cityName = json[0].name;
  if (json[0].local_names.fr) {
    cityName = json[0].local_names.fr;
  }

  return {
    name: cityName,
    lat: json[0].lat,
    lon: json[0].lon,
    country: json[0].country,
  };
}

async function getWeatherData(lat, lon) {
  const exclude = "minutely,hourly,daily,alerts"
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;

  const response = await fetch(weatherURL);
  if (!response.ok) {
    console.log("server error: ", response);
    return {error: "Impossible de trouver la météo pour cette ville."};
  }

  return await response.json();
}

async function fetchWeather(city) {
  const geocodeData = await getGeocodeData(city);
  if (geocodeData.error) {
    return {error: geocodeData.error};
  }

  const weatherData = await getWeatherData(geocodeData.lat, geocodeData.lon);
  if (weatherData.error) {
    return {error: geocodeData.error};
  }

  return {
    name: geocodeData.name,
    country: geocodeData.country,
    temp: weatherData.main.temp,
    weather: weatherData.weather[0].main
  };
}

module.exports = fetchWeather;