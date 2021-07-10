const comicsContainer = document.querySelector("#comics-container");

function buildComicCardHTML(comicData) {
  return `<div id="comics-card" class="comics-card">
            <h1 id="comics-title">${comicData["title"]}</h1>
            <img id="comics-image" src="${comicData["img"]}"/>
          </div>`;
}

async function showComicNumber(number) {
  const newComicCard = document.createElement("div");

  const response = await fetch(`https://xkcd.vercel.app/?comic=${number}`);
  const comicData = await response.json();

  newComicCard.innerHTML = buildComicCardHTML(comicData);

  comicsContainer.appendChild(newComicCard);
}
showComicNumber(1);
showComicNumber(5);
showComicNumber(100);
