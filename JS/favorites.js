// Selecting the card container from the DOM
let cardContainer = document.getElementById("container");

window.addEventListener("load", function () {
  let favourites = localStorage.getItem("favouriteCharacters");

  if (favourites == null) {
    cardContainer.innerHTML =
      '<p class="no-characters">No characters present in Favourites</p>';
    return;
  } else {
    favourites = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
  }

  if (favourites.length == 0) {
    cardContainer.innerHTML =
      '<p class="no-characters">No characters present in Favourites</p>';
    return;
  }

  cardContainer.innerHTML = "";
  // console.log(favourites)
  favourites.forEach((character) => {
    // console.log(character);
    cardContainer.innerHTML += `
               <div class="flex-col card">
                    <img src="${character.squareImage}" alt="">
                    <span class="name">${character.name}</span>
                    <span class="id">Id : ${character.id}</span>
                    <span class="comics">Comics : ${character.comics}</span>
                    <span class="series">Series : ${character.series}</span>
                    <span class="stories">Stories : ${character.stories}</span>
                    <a class="character-info" href="./more-info.html">
                         <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button>
                    </a>
                    <div style="display:none;">
                         <span>${character.id}</span>
                         <span>${character.name}</span>
                         <span>${character.comics}</span>
                         <span>${character.series}</span>
                         <span>${character.stories}</span>
                         <span>${character.description}</span>
                         <span>${character.landscapeImage}</span>
                         <span>${character.portraitImage}</span>
                         <span>${character.squareImage}</span>
                    </div>
                    <button class="btn remove-btn"><i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove</button>
               </div>
          `;
  });

  addEvent();
});

function addEvent() {
  let removeBtn = document.querySelectorAll(".remove-btn");
  removeBtn.forEach((btn) =>
    btn.addEventListener("click", removeCharacterFromFavourites)
  );

  let characterInfo = document.querySelectorAll(".character-info");
  characterInfo.forEach((character) =>
    character.addEventListener("click", addInfoInLocalStorage)
  );
}
// function for remove character from favourites
function removeCharacterFromFavourites() {
  let idOfCharacterToBeDeleted =
    this.parentElement.children[2].innerHTML.substring(5);

  let favourites = JSON.parse(localStorage.getItem("favouriteCharacters"));

  let favouritesCharacterIDs = new Map(
    JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
  );

  favouritesCharacterIDs.delete(`${idOfCharacterToBeDeleted}`);

  favourites.forEach(function (favourite, index) {
    if (favourite.id == idOfCharacterToBeDeleted) {
      // console.log(favourite)
      favourites.splice(index, 1);
    }
  });

  if (favourites.length == 0) {
    cardContainer.innerHTML =
      '<p class="no-characters">No characters present in Favourites</p>';
  }
  // console.log(favourites);
  localStorage.setItem("favouriteCharacters", JSON.stringify(favourites));
  localStorage.setItem(
    "favouritesCharacterIDs",
    JSON.stringify([...favouritesCharacterIDs])
  );

  // Removing the element from DOM
  this.parentElement.remove();

  // displaying the "Removed from favourites" toast in DOM
  document
    .querySelector(".remove-toast")
    .setAttribute("data-visiblity", "show");
  // Removing the "Removed from favourites" toast form DOM
  setTimeout(function () {
    document
      .querySelector(".remove-toast")
      .setAttribute("data-visiblity", "hide");
  }, 1000);
}

// Function which stores the info object of character for which user want to see the info
function addInfoInLocalStorage() {
  let heroInfo = {
    name: this.parentElement.children[7].children[1].innerHTML,
    description: this.parentElement.children[7].children[5].innerHTML,
    comics: this.parentElement.children[7].children[2].innerHTML,
    series: this.parentElement.children[7].children[3].innerHTML,
    stories: this.parentElement.children[7].children[4].innerHTML,
    portraitImage: this.parentElement.children[7].children[7].innerHTML,
    id: this.parentElement.children[7].children[0].innerHTML,
    landscapeImage: this.parentElement.children[7].children[6].innerHTML,
  };

  localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
