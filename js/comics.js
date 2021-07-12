const comicsContainer = document.querySelector("#comics-container");
const newComicCardParent = document.createElement("div");
const search = document.createElement("div");

let currentComicNumber = 1;
const lastComicNumber = 2475;
// display X comic(s) per page. Default at 1
let displayPerPage = 1;

/*================================================================================
|--------------------------------------------------------------------------------|
================================================================================*/
function buildComicCardHTML(comicData) {
  return `<div id="comic-card" class="comic-card">
            <h1 id="comics-title">${comicData["title"]}</h1>
            <img id="comic-image" src="${comicData["img"]}"/>
            <p class="comic-number" >${comicData["num"]}</p>
          </div>`;
}

function loaderHTML() {
  return `<box class="loader-container"><div class="lds-heart"><div></div></div></box>`;
}

function searchAlert(status) {
  searchCard = document.createElement("div");
  search.innerHTML = `<div class="search-alert-card">${status}</div>`;

  // Delete alert after X seconds
  setTimeout(function () {
    search.remove();
  }, 2000);
  return search;
}

/*================================================================================
|--------------------------------------------------------------------------------|
================================================================================*/

/*
 Get data for given comic number from API
 and display: title, image, number.

 args:
  number: integer

returns:
  none

  e.g. Given number = 10, get comic number 10's title,
  image, number and put into a UI component
*/
async function displayComicNumber(number) {
  const newComicCard = document.createElement("div");
  const response = await fetch(`https://xkcd.vercel.app/?comic=${number}`);
  const comicData = await response.json();

  newComicCard.innerHTML = buildComicCardHTML(comicData);

  // To allow stacking of comic cards
  newComicCardParent.appendChild(newComicCard);
}

/*
  Get comic numbers to be displayed according to the view per page
 args:
  number: integer

returns:
  none

  e.g. 
*/
async function displayComics(numComicsPerPage) {
  comicsContainer.innerHTML = loaderHTML();
  for (let idx = 0; idx < numComicsPerPage; idx++) {
    let displayingComic = Number(currentComicNumber) + Number(idx);

    if (currentComicNumber < 1) {
      displayingComic =
        Number(lastComicNumber) + Number(currentComicNumber) + Number(idx);
    }
    if (displayingComic > lastComicNumber) {
      displayingComic = Number(displayingComic) - Number(lastComicNumber);
    }
    await displayComicNumber(displayingComic);
  }
  window.setTimeout(function () {
    comicsContainer.innerHTML = "";
    comicsContainer.appendChild(newComicCardParent);
  }, 2000);
}

function changeComicsDisplay() {
  displayPerPage = document.querySelector("#display-number");
  return displayPerPage.value;
}

function previousPageBtn() {
  currentComicNumber = Number(currentComicNumber) - Number(displayPerPage);
  updateComicsPage();
}

function nextPageBtn() {
  currentComicNumber = Number(currentComicNumber) + Number(displayPerPage);
  updateComicsPage();
}

function randomPageBtn() {
  currentComicNumber = Math.floor(Math.random() * lastComicNumber + 1);
  updateComicsPage();
}

/*================================================================================
|--------------------------------------------------------------------------------|
================================================================================*/

function searchValidation(searchTerm) {
  let statusText = "";
  if (searchTerm === "") {
    statusText = "No comic number entered";
  } else if (Number.isInteger(Number(searchTerm)) === false) {
    statusText = "Invalid comic number. Comic number must be an integer.";
  } else if (Number(searchTerm) < 0) {
    statusText = "Invalid comic number. Comic number must be positive.";
  } else if (Number(searchTerm) > lastComicNumber) {
    statusText = `Invalid comic number. Comic number has over exceeded. Try searching a comic number smaller than ${lastComicNumber}`;
  } else if (
    Number.isInteger(Number(searchTerm)) &&
    Number(searchTerm) > 0 &&
    Number(searchTerm) <= lastComicNumber
  ) {
    statusText = `Comic number ${searchTerm} is found successfully`;
  }
  return {
    status:
      Number.isInteger(Number(searchTerm)) &&
      Number(searchTerm) > 0 &&
      Number(searchTerm) <= lastComicNumber,
    statusText: statusText,
  };
}

function searchComicNumber() {
  const searchInput = document.querySelector("#input-text");

  const result = searchValidation(searchInput.value);
  document.body.appendChild(searchAlert(result.statusText));

  if (result.status === true) {
    currentComicNumber = Number(searchInput.value);
    updateComicsPage();
  }
  searchInput.value = "";
}

/*================================================================================
|--------------------------------------------------------------------------------|
================================================================================*/

async function updateComicsPage() {
  newComicCardParent.innerHTML = "";
  displayPerPage = changeComicsDisplay();

  displayComics(displayPerPage);
}
