const API_KEY = "zY3Avq8emrAmsROJkkKU0tYw3F1apeieqjzvJzM2"; 

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const imageContainer = document.getElementById("current-image-container");
const searchHistory = document.getElementById("search-history");

// ---------- DISPLAY IMAGE / VIDEO ----------
function displayImage(data) {
    if (data.media_type === "video") {
        imageContainer.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.date}</p>
            <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
            <p>${data.explanation}</p>
        `;
    } else {
        imageContainer.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.date}</p>
            <img src="${data.url}" alt="${data.title}" />
            <p>${data.explanation}</p>
        `;
    }
}

// ---------- GET CURRENT IMAGE ----------
function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                imageContainer.innerHTML = `<p>${data.error.message}</p>`;
                return;
            }
            displayImage(data);
        })
        .catch(() => {
            imageContainer.innerHTML = "<p>Error fetching image</p>";
        });
}

// ---------- GET IMAGE BY DATE ----------
function getImageOfTheDay(date) {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                imageContainer.innerHTML = `<p>${data.error.message}</p>`;
                return;
            }
            displayImage(data);
            saveSearch(date);
            addSearchToHistory();
        })
        .catch(() => {
            imageContainer.innerHTML = "<p>Error fetching image</p>";
        });
}

// ---------- SAVE SEARCH ----------
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

// ---------- ADD SEARCH HISTORY ----------
function addSearchToHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searchHistory.innerHTML = "";

    searches.forEach(date => {
        const li = document.createElement("li");
        li.innerText = date;
        li.addEventListener("click", () => {
            getImageOfTheDay(date);
        });
        searchHistory.appendChild(li);
    });
}

// ---------- FORM SUBMIT ----------
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedDate = input.value;
    getImageOfTheDay(selectedDate);
});

// ---------- INITIAL LOAD ----------
getCurrentImageOfTheDay();
addSearchToHistory();
