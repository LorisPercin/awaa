const searchForm = document.getElementById("search-form");
const errorMsg = document.getElementById("error");
const citySpan = document.getElementById("data-city");
const tempSpan = document.getElementById("data-temp");
const descSpan = document.getElementById("data-desc");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = new FormData(searchForm).get("search");

  fetch("/weather?city=" + city).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        errorMsg.textContent = data.error
      } else {
        console.log(data)
        citySpan.textContent = `${data.name}, ${data.country}`;
        tempSpan.textContent = data.temp + "°C"
        descSpan.textContent = data.weather;
      }
    })
  })
})