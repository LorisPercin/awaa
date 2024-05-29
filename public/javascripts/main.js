const searchForm = document.getElementById("search-form");
const errorMsg = document.getElementById("error");
const citySpan = document.getElementById("data-city");
const tempSpan = document.getElementById("data-temp");
const descSpan = document.getElementById("data-desc");
const descIcon = document.getElementById("data-desc-icon");

let localTimestamp = new Date().getTime();

startClock();

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = new FormData(searchForm).get("search");

  fetch("/weather?city=" + city).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        errorMsg.textContent = data.error
      } else {
        errorMsg.textContent = ""
        citySpan.textContent = `${data.name}, ${data.country}`;
        tempSpan.textContent = data.temp + "°C";
        descSpan.textContent = data.weather.description;
        descIcon.setAttribute("href", `/images/weather_icons/${data.weather.icon}.svg`);
        localTimestamp = data.timestamp;
      }
    })
  })
})


function displayTime(date) {
  let h = date.getUTCHours();
  let m = date.getUTCMinutes();
  let s = date.getUTCSeconds();

  // Make single digits into number
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;

  document.getElementById("local-time").innerText = h + ":" + m + ":" + s;
}

function startClock() {
  displayTime(new Date(localTimestamp));
  localTimestamp += 1000
  setTimeout(startClock, 1000);
}