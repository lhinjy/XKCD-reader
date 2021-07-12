const comicsContainer = document.querySelector("#comics-container");
const newComicCardParent = document.createElement("div");

let currentComicNumber = 1;
const lastComicNumber = 2475;
let displayNumber = 1;

function buildComicCardHTML(comicData) {
  return `<div id="comics-card" class="comics-card">
            <h1 id="comics-title">${comicData["title"]}</h1>
            <img id="comics-image" src="${comicData["img"]}"/>
            <p class="comics-title" >${comicData["num"]}</p>
          </div>`;
}

function loaderHTML() {
  return `<box class="loader-container"><div class="lds-heart"><div></div></div></box>`;
}

function searchAlert(status) {
  const search = document.createElement("div");
  search.innerHTML = `<div class="search-card">${status}</div>`;
  return search;
}

async function showComicNumber(number) {
  const newComicCard = document.createElement("div");
  const response = await fetch(`https://xkcd.vercel.app/?comic=${number}`);
  const comicData = await response.json();

  newComicCard.innerHTML = buildComicCardHTML(comicData);
  newComicCardParent.appendChild(newComicCard);
}

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
    await showComicNumber(displayingComic);
  }
  window.setTimeout(function () {
    comicsContainer.innerHTML = "";
    comicsContainer.appendChild(newComicCardParent);
  }, 1000);
}

function changeComicsDisplay() {
  displayNumber = document.querySelector("#display-number");
  return displayNumber.value;
}

function comicsPageLogic() {
  if (currentComicNumber === 0) {
    currentComicNumber = lastComicNumber;
  }
  if (currentComicNumber === 2476) {
    currentComicNumber = 1;
  }
}

function previousPageBtn() {
  currentComicNumber = Number(currentComicNumber) - Number(displayNumber);
  updateComicsPage();
}

function nextPageBtn() {
  currentComicNumber = Number(currentComicNumber) + Number(displayNumber);
  updateComicsPage();
}

function randomPageBtn() {
  currentComicNumber = Math.floor(Math.random() * lastComicNumber + 1);
  updateComicsPage();
}

function searchValidation(searchTerm) {
  return (
    Number.isInteger(Number(searchTerm)) &&
    Number(searchTerm) > 0 &&
    Number(searchTerm) <= lastComicNumber
  );
}

function searchComicNumber() {
  const searchInput = document.querySelector("#input-text");
  const result = searchValidation(searchInput.value);
  if (result) {
    currentComicNumber = Number(searchInput.value);
    document.body.appendChild(searchAlert("Comic number found"));

    updateComicsPage();
  }
}

async function updateComicsPage() {
  comicsContainer.innerHTML = "";
  newComicCardParent.innerHTML = "";
  displayNumber = changeComicsDisplay();
  comicsPageLogic();

  displayComics(displayNumber);
}
