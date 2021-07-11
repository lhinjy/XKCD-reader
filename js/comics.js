const comicsContainer = document.querySelector("#comics-container");
let currentComicNumber = 1;
const lastComicNumber = 2475;
// default at 1
let displayNumber = 1;

function buildComicCardHTML(comicData) {
  return `<div id="comics-card" class="comics-card">
            <h1 id="comics-title">${comicData["title"]}</h1>
            <img id="comics-image" src="${comicData["img"]}"/>
            <p class="comics-title" >${comicData["num"]}</p>
          </div>`;
}

async function showComicNumber(number) {
  const newComicCard = document.createElement("div");
  const response = await fetch(`https://xkcd.vercel.app/?comic=${number}`);
  const comicData = await response.json();

  newComicCard.innerHTML = buildComicCardHTML(comicData);
  comicsContainer.appendChild(newComicCard);
}

async function displayComics(numComicsPerPage) {
  for (let idx = 0; idx < numComicsPerPage; idx++) {
    await showComicNumber(currentComicNumber + idx);
  }
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

function previousPage() {
  currentComicNumber = Number(currentComicNumber) - Number(displayNumber);
  updateComicsPage();
}

function nextPage() {
  currentComicNumber = Number(currentComicNumber) + Number(displayNumber);
  updateComicsPage();
}

function randomPage() {
  currentComicNumber = Math.floor(Math.random() * lastComicNumber + 1);
  updateComicsPage();
}

function updateComicsPage() {
  comicsContainer.innerHTML = "";
  displayNumber = changeComicsDisplay();
  comicsPageLogic();
  displayComics(displayNumber);
}
updateComicsPage();
