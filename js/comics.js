const comicsContainer = document.querySelector("#comics-container");
const newComicCardParent = document.createElement("div");
const search = document.createElement("div");

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
  searchCard = document.createElement("div");
  search.innerHTML = `<div class="search-card">${status}</div>`;

  setTimeout(function () {
    search.remove();
  }, 3000);
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
  let statusText = "";
  if (Number.isInteger(Number(searchTerm)) === false) {
    statusText =
      statusText +
      "Invalid comic number." +
      "\n" +
      "Comic number must be an integer." +
      "\n";
  }
  if (Number(searchTerm) < 0) {
    statusText =
      statusText +
      "Invalid comic number. Comic number must be positive." +
      "\n";
  }
  if (Number(searchTerm) > lastComicNumber) {
    statusText =
      statusText +
      `Invalid comic number. Comic number has over exceeded. Try searching a comic number smaller than ${lastComicNumber}` +
      "\n";
  } else if (
    Number.isInteger(Number(searchTerm)) &&
    Number(searchTerm) > 0 &&
    Number(searchTerm) <= lastComicNumber
  ) {
    statusText = "Search successful";
  }
  return [
    Number.isInteger(Number(searchTerm)) &&
      Number(searchTerm) > 0 &&
      Number(searchTerm) <= lastComicNumber,
    statusText,
  ];
}

function searchComicNumber() {
  const searchInput = document.querySelector("#input-text");
  const result = searchValidation(searchInput.value);
  document.body.appendChild(searchAlert(result[1]));

  if (result[0]) {
    currentComicNumber = Number(searchInput.value);
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
