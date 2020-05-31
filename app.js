const domElements = {
    countryPanel: document.querySelector(".countries"),
    loader: document.querySelector(".loader"),
    regionSelector: document.querySelector(".search__region"),
    searchInput: document.querySelector(".search__input"),
    resultPanel: document.querySelector(".result"),
    countryDetails: document.querySelector(".details"),
    header: document.querySelector(".header"),
    themeBtn: document.querySelector(".nav__theme"),
};


async function getData() {
    try {
        const data = await fetch(`https://restcountries.eu/rest/v2/all
        `);
        const countriesData = await data.json();

        // console.log(countriesData);

        renderResults(countriesData);
    } catch (err) {
        alert("Error processing data. Please refresh 😅");
    }
}

async function getCountryByRegion(region) {
    try {
        const data = await fetch(
            `https://restcountries.eu/rest/v2/region/${region}`
        );
        const countries = await data.json();
        // console.log(countries);
        renderResults(countries);
    } catch (error) {}
}

async function getCountryByName(countryName) {
    try {
        const data = await fetch(
            `https://restcountries.eu/rest/v2/name/${countryName}`
        );
        const countries = await data.json();
        // console.log(countries);
        renderResults(countries);
    } catch (err) {
        alert("No country by that name");
    }
}

async function getCountryData(code) {
    const data = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
    const countryData = await data.json();
    // console.log(countryData);
    renderCountryData(countryData);
}

async function getCountryName(code) {
    const data = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
    const countryData = await data.json();
}

function renderCountryData(countryData) {
    clearDetailsPanel();

    const markup = `
    <div class="details__cover">
        <img src="${countryData.flag}" alt="sample" class="details__img">
    </div>

        <div class="details__text">
            <h3 class="details__name"> ${countryData.name}</h3>
            <div class="details__info">
                <p class="details__native">Native Name: ${
                    countryData.nativeName
                }</p>
                <p class="details__population">Population: ${formatNumber(
                    countryData.population
                )}</p>
                <p class="details__region">Region: ${countryData.region}</p>
                <p class="details__subregion">Sub Region: ${
                    countryData.subregion
                }</p>
                <p class="details__capital">Capital: ${countryData.capital}</p>
                <div class="space"></div>
                <p class="details__domain">Top Level Domain:${
                    countryData.topLevelDomain.length === 0
                        ? "none"
                        : countryData.topLevelDomain[0]
                }</p>
                <p class="details__currency">Currencies: ${
                    countryData.currencies[0].name
                }</p>
                <p class="details__language">Languages: ${
                    countryData.languages[0].name
                }</p>
            </div>
            <div class="space"></div>

            <div class="details__related">
                <span>Border Countries:</span>
                ${showBorderCountries(countryData.borders)}
            </div>
        </div>
    `;

    domElements.countryDetails.insertAdjacentHTML("beforeend", markup);
}

function renderResults(countryData) {
    clearPanel();
    countryData.forEach((country) => {
        const markup = ` 
        <a class="card" href='#${country.alpha3Code}'>
            <div class="card__cover">
                <img src="${country.flag}" alt="" class="card__img">
            </div>
            <div class="card__text">
                <h3 class="card__name">${country.name}</h3>
                <p class="card__population">Population: <span class="population-count">${formatNumber(
                    country.population
                )}</span></p>
                <p class="card__region">Region: <span class="region-name">${
                    country.region
                }</span></p>
                <p class="card__capital">Capital: <span class="capital-name">${
                    country.capital
                }</span></p>
            </div>
        </a>`;
        domElements.countryPanel.insertAdjacentHTML("beforeend", markup);
    });
}

function displayCountryData() {
    const id = window.location.hash.replace("#", "");
    domElements.header.style.display = "none";
    domElements.resultPanel.style.display = "block";
    getCountryData(id);
}

function showBorderCountries(arr) {
    let markup = ``;
    if (arr.length === 0) {
        markup = "<p>No borders</p>";
    } else {
        arr.forEach((code) => {
            markup += `<a class="details__relation" href="#${code}">${code}</a>`;
        });
    }

    return markup;
}

function clearPanel() {
    domElements.countryPanel.innerHTML = "";
}

function clearDetailsPanel() {
    domElements.countryDetails.innerHTML = "";
}

function backToMain(e) {

    if(e.target.className.includes('back')){
        domElements.header.style.display = "block";
        domElements.resultPanel.style.display = "none";
        window.location.hash.replace()
        history.pushState(1,'','index.html');
        getData();
    }
}

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changeTheme() {
    document.body.classList.toggle("lightModeBg");
    document.querySelector(".nav").classList.toggle("lightModeNav");
    document.querySelector(".search__field").classList.toggle("lightMode");
    document.querySelector(".search__region").classList.toggle("lightMode");
    document.querySelectorAll(".card").forEach((card) => {
        card.classList.toggle("lightMode");
    });
    document.querySelector(".back").classList.toggle("lightMode2");
    document.querySelector(".details__relation").classList.toggle("lightMode2");
}

// Controller

// display all countries
setTimeout(() => {
    domElements.loader.remove();
    getData();
}, 3000);

//filter country by regioon
domElements.regionSelector.addEventListener("change", () => {
    const currentRegion = domElements.regionSelector.value;
    if (currentRegion === "all") {
        getData();
    } else {
        getCountryByRegion(currentRegion);
    }
});

//search by country name

domElements.searchInput.addEventListener("keyup", () => {
    if (domElements.searchInput.value !== "") {
        getCountryByName(domElements.searchInput.value);
    } else {
        getData();
    }
});

window.addEventListener("hashchange", displayCountryData);

domElements.resultPanel.addEventListener("click", backToMain);

domElements.themeBtn.addEventListener("click", changeTheme);
