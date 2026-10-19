document.addEventListener("DOMContentLoaded", function () { 
  
  const searchButton = document.querySelector('.js-search-button');
  const searchInput = document.querySelector('.js-search-input');

  searchButton.addEventListener("click", function() {
    document.querySelector('.js-key-result').textContent = '';
    encodeURL();
  });

  searchInput.addEventListener("keydown", (event) => {
    checkKey(event);
  });
});

function encodeURL() {
  const inputVar = document.querySelector('.js-search-input');
  const artistRaw = inputVar.value;
  
  const artist = encodeURIComponent(artistRaw);
  
  document.querySelector('.js-search-result-div').replaceChildren();
  // If a user searches up another artist, clear Artist 1's results

  getData(artist);
}

async function getData(queryVar) {
  const url = `https://itunes.apple.com/search?term=${queryVar}&entity=musicArtist&limit=50`;

  const response = await fetch(url);

  if (!response.ok) {
    document.querySelector('.js-search-result-div').textContent = `response info: ${response.status}`;
  } 

  const result = await response.json();

  dataLoop(result);
}

// MDN's guide to using fetch loops really helped: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

function checkKey(event) {
  keyResult = document.querySelector('.js-key-result');

  keyResult.textContent = `press: ${event.key}`;

  if (event.key === 'Enter') {
    keyResult.textContent = '';
    // Clear key press tracker so data is central focus

    encodeURL();
  }
}

function dataLoop(mainObject) {
  const resultDiv = document.querySelector('.js-search-result-div');
  const docFrag = document.createDocumentFragment();

  const resultList = mainObject.results;

  const resultCount = document.createElement("p");
  resultCount.textContent = `${mainObject.resultCount} result(s)`;
  docFrag.appendChild(resultCount);

  docFrag.appendChild(document.createElement("hr"));

  for (let objectInList of resultList) {

    const aloneResult = document.createElement("div");
    aloneResult.classList.add("alone-result");
    docFrag.appendChild(aloneResult);

    const resultLink = document.createElement("a");
    resultLink.classList.add("result-link");
    resultLink.href = `artist/?id=${objectInList.artistId}`;
    resultLink.textContent = `${objectInList.artistName}`;

    aloneResult.appendChild(resultLink);

    if (objectInList.primaryGenreName !== undefined) { 
      const resultGenre = document.createElement("p");
      resultGenre.textContent = `Genre: ${objectInList.primaryGenreName}`;
      aloneResult.appendChild(resultGenre);
    }

    const resultID = document.createElement("p");
    resultID.textContent = `ID: ${objectInList.artistId}`;
    aloneResult.appendChild(resultID);
  }

  resultDiv.appendChild(docFrag);
}

function modeSwitch() {
  const modeButton = document.querySelector('.mode-button');

  if (modeButton.textContent === "Dark Mode") {
    modeButton.textContent = "Light Mode";
  } else {
    modeButton.textContent = "Dark Mode";
  }

  document.body.classList.toggle("body-dark-mode");
}