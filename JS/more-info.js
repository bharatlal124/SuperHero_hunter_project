// Selecting the elements from the DOM
let info = document.getElementById("info-container");
let title = document.getElementById("page-title");

let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));

title.innerHTML = heroInfo.name + " | SH";

window.addEventListener("load", function () {
  let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
  if (favouritesCharacterIDs == null) {
    favouritesCharacterIDs = new Map();
  } else if (favouritesCharacterIDs != null) {
    favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );
  }

  info.innerHTML = `
               <div class="flex-row hero-name">${heroInfo.name}</div>
               <div class="flex-row hero-img-and-more-info">
                    <img id="portraitImage" class="hero-img" src="${
                      heroInfo.portraitImage
                    }" alt="">
                    <img style="display:none;" id="landscapeImage" src="${
                      heroInfo.landscapeImage
                    }" alt="">
                    <div class="flex-col more-info">
                         <div class="flex-row id">
                              <b>ID:</b><span>${heroInfo.id}</span>
                         </div>
                         <div class="flex-row comics">
                              <b>Comics:</b><span>${heroInfo.comics}</span>
                         </div>
                         <div class="flex-row series">
                              <b>Series:</b><span>${heroInfo.series}</span>
                         </div>
                         <div class="flex-row stories">
                              <b>Stories:</b><span>${heroInfo.stories}</span>
                         </div>
                    </div>
               </div>
               <div class="flex-col hero-discription">
                    <b>Discription:</b>
                    <p>${
                      heroInfo.description != ""
                        ? heroInfo.description
                        : "No Description Available"
                    }</p>
               </div>
               <div style="display:none;">
                    <span>${heroInfo.name}</span>
                    <span>${heroInfo.portraitImage}</span>
                    <span>${heroInfo.landscapeImage}</span>
                    <span>${heroInfo.id}</span>
                    <span>${heroInfo.comics}</span>
                    <span>${heroInfo.series}</span>
                    <span>${heroInfo.stories}</span>
                    <span>${heroInfo.squareImage}</span>
                    <span>${heroInfo.description}</span>
               </div>
               <button class="btn add-to-fav-btn">${
                 favouritesCharacterIDs.has(`${heroInfo.id}`)
                   ? '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove'
                   : '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add </button>'
               }

          `;
  // Calling the function so that event is added
  addEvent();
});

window.addEventListener("resize", function () {
  let portraitImage = document.getElementById("portraitImage");
  let landscapeImage = document.getElementById("landscapeImage");

  if (document.body.clientWidth < 678) {
    portraitImage.style.display = "none";
    landscapeImage.style.display = "block";
  } else {
    landscapeImage.style.display = "none";
    portraitImage.style.display = "block";
  }
});

function addEvent() {
  let favouriteButton = document.querySelector(".add-to-fav-btn");
  favouriteButton.addEventListener("click", addToFavourites);
}

function addToFavourites() {
  if (
    this.innerHTML ==
    '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites'
  ) {
    let heroInfo = {
      name: this.parentElement.children[3].children[0].innerHTML,
      description: this.parentElement.children[3].children[8].innerHTML,
      comics: this.parentElement.children[3].children[4].innerHTML,
      series: this.parentElement.children[3].children[5].innerHTML,
      stories: this.parentElement.children[3].children[6].innerHTML,
      portraitImage: this.parentElement.children[3].children[1].innerHTML,
      id: this.parentElement.children[3].children[3].innerHTML,
      landscapeImage: this.parentElement.children[3].children[2].innerHTML,
      squareImage: this.parentElement.children[3].children[7].innerHTML,
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

    // adding the above created heroInfo object to favouritesArray
    favouritesArray.push(heroInfo);

    // Storing the new favouritesCharactersID map to localStorage after converting to string
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
    // Deleting the "Added to Favourites" toast from DOM after 1 seconds
    setTimeout(function () {
      document
        .querySelector(".fav-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
  }
  // For removing the character form favourites array
  else {
    // storing the id of character in a variable
    // console.log(this.parentElement.children[3].children[3].innerHTML)
    let idOfCharacterToBeRemoveFromFavourites =
      this.parentElement.children[3].children[3].innerHTML;

    let favouritesArray = JSON.parse(
      localStorage.getItem("favouriteCharacters")
    );

    let favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );

    let newFavouritesArray = [];
    // let newFavouritesCharacterIDs = [];

    favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);

    favouritesArray.forEach((favourite) => {
      if (idOfCharacterToBeRemoveFromFavourites != favourite.id) {
        newFavouritesArray.push(favourite);
      }
    });

    // console.log(newFavouritesArray)

    // Updating the new array in localStorage
    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(newFavouritesArray)
    );
    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );

    // Convering the "Remove from Favourites" button to "Add to Favourites"
    this.innerHTML =
      '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';

    // Displaying the "Remove from Favourites" toast to DOM
    document
      .querySelector(".remove-toast")
      .setAttribute("data-visiblity", "show");
    // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
    setTimeout(function () {
      document
        .querySelector(".remove-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
    
  }
}
