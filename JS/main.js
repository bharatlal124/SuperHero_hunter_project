//* Selecting the element from DOM
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Adding eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));

// My public OR private Api key
const publicApiKey = "6cf6c4ba4800cf4918b430cd6c74832e";
const privateApiKey = "5a60fd415c6845574c06a17bc2eeea331734bde3";

// Function to generate MD5 hash
function generateHash(ts, privateKey, publicKey) {
  const stringToHash = ts + privateKey + publicKey;
  const md5Hash = CryptoJS.MD5(stringToHash).toString();
  return md5Hash;
}

// Function to get the current timestamp
function getCurrentTimestamp() {
  return new Date().getTime().toString();
}

const timestamp = getCurrentTimestamp();
const hash = generateHash(timestamp, privateApiKey, publicApiKey);

console.log("Timestamp:", timestamp);
console.log("MD5 Hash:", hash);

// function for API call
async function searchHeros(textSearched) {
  // if there is no text written in the search bar then nothing is displayed
  if (textSearched.length == 0) {
    searchResults.innerHTML = ``;
    return;
  }

  const timestamp = getCurrentTimestamp();
  const hash = generateHash(timestamp, privateApiKey, publicApiKey);
  const searchInput = document.getElementById("search-bar").value;
  const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${publicApiKey}&hash=${hash}&nameStartsWith=${searchInput}`;

  // API call to get the data
  await fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => showSearchedResults(data.data.results));
}
// function for show result after search 
function showSearchedResults(searchedHero) {
  let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
  if (favouritesCharacterIDs == null) {
    // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
    favouritesCharacterIDs = new Map();
  } else if (favouritesCharacterIDs != null) {
    // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
    favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );
  }

  searchResults.innerHTML = ``;
  let count = 1;

  // iterating the searchedHero array using for loop
  for (const key in searchedHero) {
    // if count <= 5 then only we display it in dom other results are discarded
    if (count <= 8) {
      let hero = searchedHero[key];
      // Appending the element into DOM
      searchResults.innerHTML += `
            <li class="flex-row single-search-result">
                 <div class="flex-row img-info">
                      <img src="${
                        hero.thumbnail.path +
                        "/portrait_medium." +
                        hero.thumbnail.extension
                      }" alt="">
                      <div class="hero-info">
                           <a class="character-info" href="./more-info.html">
                                <span class="hero-name">${hero.name}</span>
                           </a>
                      </div>
                 </div>
                 <div class="flex-col buttons">
                      <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                      <button class="btn add-to-fav-btn">${
                        favouritesCharacterIDs.has(`${hero.id}`)
                          ? '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites'
                          : '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites</button>'
                      }
                 </div>
                 <div style="display:none;">
                      <span>${hero.name}</span>
                      <span>${hero.description}</span>
                      <span>${hero.comics.available}</span>
                      <span>${hero.series.available}</span>
                      <span>${hero.stories.available}</span>
                      <span>${
                        hero.thumbnail.path +
                        "/portrait_uncanny." +
                        hero.thumbnail.extension
                      }</span>
                      <span>${hero.id}</span>
                      <span>${
                        hero.thumbnail.path +
                        "/landscape_incredible." +
                        hero.thumbnail.extension
                      }</span>
                      <span>${
                        hero.thumbnail.path +
                        "/standard_fantastic." +
                        hero.thumbnail.extension
                      }</span>
                 </div>
            </li>
            `;
    }
    count++;
  }

  events();
}

function events() {
  let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
  favouriteButton.forEach((btn) =>
    btn.addEventListener("click", addToFavourites)
  );

  let characterInfo = document.querySelectorAll(".character-info");
  characterInfo.forEach((character) =>
    character.addEventListener("click", addInfoInLocalStorage)
  );
}
// function for add card to favourites 
function addToFavourites() {
  if (
    this.innerHTML ==
    '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites'
  ) {
    let heroInfo = {
      name: this.parentElement.parentElement.children[2].children[0].innerHTML,
      description:
        this.parentElement.parentElement.children[2].children[1].innerHTML,
      comics:
        this.parentElement.parentElement.children[2].children[2].innerHTML,
      series:
        this.parentElement.parentElement.children[2].children[3].innerHTML,
      stories:
        this.parentElement.parentElement.children[2].children[4].innerHTML,
      portraitImage:
        this.parentElement.parentElement.children[2].children[5].innerHTML,
      id: this.parentElement.parentElement.children[2].children[6].innerHTML,
      landscapeImage:
        this.parentElement.parentElement.children[2].children[7].innerHTML,
      squareImage:
        this.parentElement.parentElement.children[2].children[8].innerHTML,
    };

    let favouritesArray = localStorage.getItem("favouriteCharacters");

    if (favouritesArray == null) {
      favouritesArray = [];
    } else {
      favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
    }

    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

    if (favouritesCharacterIDs == null) {
      favouritesCharacterIDs = new Map();
    } else {
      favouritesCharacterIDs = new Map(
        JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
      );
      // favouritesCharacterIDs = new Map(Object.entries(favouritesCharacterIDs));
    }

    favouritesCharacterIDs.set(heroInfo.id, true);
    // console.log(favouritesCharacterIDs)

    favouritesArray.push(heroInfo);
    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );

    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(favouritesArray)
    );

    // Convering the "Add to Favourites" button to "Remove from Favourites"
    this.innerHTML =
      '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';

    // Displaying the "Added to Favourites" toast to DOM
    document.querySelector(".fav-toast").setAttribute("data-visiblity", "show");

    setTimeout(function () {
      document
        .querySelector(".fav-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
  } else {
    // storing the id of character in a variable
    let idOfCharacterToBeRemoveFromFavourites =
      this.parentElement.parentElement.children[2].children[6].innerHTML;

    let favouritesArray = JSON.parse(
      localStorage.getItem("favouriteCharacters")
    );

    let favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );

    let newFavouritesArray = [];

    favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);

    favouritesArray.forEach((favourite) => {
      if (idOfCharacterToBeRemoveFromFavourites != favourite.id) {
        newFavouritesArray.push(favourite);
      }
    });

    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(newFavouritesArray)
    );
    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );

    this.innerHTML =
      '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';

    document
      .querySelector(".remove-toast")
      .setAttribute("data-visiblity", "show");

    setTimeout(function () {
      document
        .querySelector(".remove-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
    // console.log();
  }
}

// Function which stores the info object of character for which user want to see the info
function addInfoInLocalStorage() {
  let heroInfo = {
    name: this.parentElement.parentElement.parentElement.children[2].children[0]
      .innerHTML,
    description:
      this.parentElement.parentElement.parentElement.children[2].children[1]
        .innerHTML,
    comics:
      this.parentElement.parentElement.parentElement.children[2].children[2]
        .innerHTML,
    series:
      this.parentElement.parentElement.parentElement.children[2].children[3]
        .innerHTML,
    stories:
      this.parentElement.parentElement.parentElement.children[2].children[4]
        .innerHTML,
    portraitImage:
      this.parentElement.parentElement.parentElement.children[2].children[5]
        .innerHTML,
    id: this.parentElement.parentElement.parentElement.children[2].children[6]
      .innerHTML,
    landscapeImage:
      this.parentElement.parentElement.parentElement.children[2].children[7]
        .innerHTML,
    squareImage:
      this.parentElement.parentElement.parentElement.children[2].children[8]
        .innerHTML,
  };

  localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
