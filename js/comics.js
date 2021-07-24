const comicsContainer = document.querySelector("#comics-container");
const newComicCardParent = document.createElement("div");
newComicCardParent.className = "comic-parent-container";
const search = document.createElement("div");

let currentComicNumber = 1;
// as required
const lastComicNumber = 2475;
// display X comic(s) per page. Default at 1
let comicPerPage = 1;

/*================================================================================
|----------------------Start of HTML functions-----------------------------------|
================================================================================*/
function buildComicCardHTML(comicData) {
  const widthValue =
    comicPerPage == 1
      ? 1
      : Math.floor(comicsContainer.offsetWidth / comicPerPage);

  return `<div id="comic-card" class="comic-card" >
            <p id="comic-title" class="comic-title">${comicData["title"]}</p>
                        <p class="comic-number" >${comicData["num"]}</p>

            <img id="comic-image" width="${widthValue - 15}"  src="${
    comicData["img"]
  }"/>
          </div>`;
}

function loaderHTML() {
  return `<box class="loader-container"><div class="lds-heart"><div></div></div></box>`;
}

function totalNumComics(comicPerPage) {
  return (document.querySelector(
    "#total-comics"
  ).innerHTML = `Displaying ${comicPerPage} out of ${lastComicNumber}`);
}

function searchAlert(status) {
  searchCard = document.createElement("div");
  search.innerHTML = `<div class="search-alert-card">${status}</div>`;

  // Delete alert after X seconds
  setTimeout(function () {
    search.remove();
  }, 5000);
  return search;
}

/*================================================================================
|---------------------End of HTML functions---------------------------------------|
================================================================================*/

/*================================================================================
|---------------------Start of comics helper functions----------------------------|
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
  Get comic numbers to be displayed according to the view per page. 
  Current comic is always at the center. 
  If comicPerPage = Y, currentComicNumber = X, 
  displayed:  X-Y/2, X-Y/2 + 1,... , X, ..., X+ Y/2 -1, X + Y/2 

 args:
  none

 returns:
  none

  e.g. Provided currentComicNumber=5, comicPerPage=3, 
        display comic number 4, 5, 6
  e.g. Provided currentComicNumber=2473, comicPerPage=5, 
        display comic number 2471, 2472, 2473, 2474, 2475

*/
async function displayComics() {
  comicsContainer.innerHTML = loaderHTML();
  const comicOffset = comicPerPage == 3 ? 1 : comicPerPage == 5 ? 2 : 0;

  for (let idx = 0; idx < comicPerPage; idx++) {
    let displayingComic =
      Number(currentComicNumber) + Number(idx) - Number(comicOffset);

    if (displayingComic < 1) {
      displayingComic =
        Number(lastComicNumber) +
        Number(currentComicNumber) +
        Number(idx) -
        Number(comicOffset);
    }
    if (displayingComic > lastComicNumber) {
      displayingComic =
        Number(displayingComic) - Number(lastComicNumber) - Number(comicOffset);
    }
    console.log(displayingComic);
    await displayComicNumber(displayingComic);
  }
  // Wait due to slow image rendering
  window.setTimeout(function () {
    comicsContainer.innerHTML = "";
    comicsContainer.appendChild(newComicCardParent);
  }, 2000);
}

// Get dropdown menu's value for comic per page
function changeComicPerPage() {
  comicPerPage = document.querySelector("#display-number");
  totalNumComics(comicPerPage.value);

  return comicPerPage.value;
}

/*================================================================================
|---------------------End of comics helper functions------------------------------|
================================================================================*/

/*================================================================================
|---------------------Start of page navigation functions--------------------------|
================================================================================*/

function previousPageBtn() {
  currentComicNumber = Number(currentComicNumber) - Number(comicPerPage);
  updateComicsPage();
}

function nextPageBtn() {
  currentComicNumber = Number(currentComicNumber) + Number(comicPerPage);
  updateComicsPage();
}

function randomPageBtn() {
  currentComicNumber = Math.floor(Math.random() * lastComicNumber + 1);
  updateComicsPage();
}
/*================================================================================
|---------------------End of page navigation functions----------------------------|
================================================================================*/

/*================================================================================
|----------------------Start of search helper functions---------------------------|
================================================================================*/

/*
  Check validty of search input:
  1. Exists
  2. Integer 
  3. Between comic range

  args:
    searchTerm: string

  returns:
    status: boolean
    statusText: string
  
  e.g. Given searchTerm="475", returns {status:true, statusText:"//success text" }
  e.g. Given searchTerm="sd", returns {status:false, statusText:"//not integer text" }
*/
function searchValidation(searchTerm) {
  let statusText = "";
  if (searchTerm === "") {
    statusText = "No comic number entered";
  } else if (Number.isInteger(Number(searchTerm)) === false) {
    statusText = "Invalid comic number. Comic number must be an integer.";
  } else if (Number(searchTerm) < 0) {
    statusText = "Invalid comic number. Comic number must be positive.";
  } else if (Number(searchTerm) > lastComicNumber) {
    statusText = `Invalid comic number. Comic number has over exceeded. 
    Try searching a comic number smaller than ${lastComicNumber}`;
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

/*
  Provide result of search input

  args:
    none
    
  returns:
    none
  
  e.g. Provided search input is valid, display comic number that
      corresponds to the search
*/
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
|----------------------End of search helper functions-----------------------------|
================================================================================*/

/*================================================================================
|----------------------Main function to update UI---------------------------------|
================================================================================*/

async function updateComicsPage() {
  newComicCardParent.innerHTML = "";
  comicPerPage = changeComicPerPage();
  displayComics();
}
