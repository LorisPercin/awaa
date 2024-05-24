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

function extractWeatherConditionData(weatherId) {
  const weatherConditions = {
    2: {
      description: "Orageux",
      icon: "cloud-lightning",
    },
    3: {
      description: "Bruineux",
      icon: "cloud-drizzle",
    },
    5: {
      description: "Pluvieux",
      icon: "cloud-rain",
    },
    6: {
      description: "Neigeux",
      icon: "snowflake",
    },
    7: {
      description: "Brumeux",
      icon: "cloud-fog",
    },
    8: {
      description: "Ensoleillé",
      icon: "sun",
    },
    81: {
      description: "Nuageux",
      icon: "cloud-sun",
    }
  }

  const weatherIdFront = weatherId.toString().charAt(0);

  if (weatherIdFront === "8" && weatherId !== 800) {
    return weatherConditions[81];
  }

  return weatherConditions[weatherIdFront];
}

async function getWeatherData(lat, lon) {
  const exclude = "minutely,hourly,daily,alerts"
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;

  const response = await fetch(weatherURL);
  if (!response.ok) {
    console.log("server error: ", response);
    return {error: "Impossible de trouver la météo pour cette ville."};
  }

  const json = await response.json();


  return {
    temp: json.main.temp,
    weather: extractWeatherConditionData(json.weather[0].id),
  };
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
    temp: weatherData.temp,
    weather: weatherData.weather
  };
}

module.exports = fetchWeather;