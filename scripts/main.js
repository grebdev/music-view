function encodeURL() {
  const inputVar = document.querySelector('.js-search-input');
  const artistRaw = inputVar.value;
  let artist = '';

  for (let i = 0; i < artistRaw.length; i++) {
    if (artistRaw[i] === ' ') {

      if (artistRaw[(i - 1)] === ' ') {
        artist += '';
      } else {
        artist += '+';
      }
    } else {
      artist += artistRaw[i];
    }
  }
  // This replaces spaces with one plus to encode URL
  
  displayHTML('.js-search-result-div');
  // If a user searches up another artist, clear Artist 1's results

  getData(artist);
}

async function getData(queryVar) {
  const url = `https://itunes.apple.com/search?term=${queryVar}&entity=musicArtist`;

  const response = await fetch(url);

  if (!response.ok) {
    displayHTML('.js-search-result-div', `<i> response info: ${response.status} </i>`, "w")
  } 

  const result = await response.json();
  // Apple returns a JSON file for lookups that becomes an Object

  dataLoop(result);
}

// MDN's guide to using fetch loops really helped: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

function checkKey(event) {
  displayHTML('.js-key-result', `<b>press: ${event.key}`, "w")

  if (event.key === 'Enter') {
    displayHTML('.js-key-result');
    // Clear key press tracker so data is central focus

    encodeURL();
  }
}

function displayHTML(thing, content="", type="w") {
  // If only the class is set, assume it overwrites data to blank content. 
  // ... this is really helpful to clear divs!

  if (type === "w") {
    document.querySelector(`${thing}`).innerHTML = `${content}`;
    // W for write

  } else if (type === "a") {
    document.querySelector(`${thing}`).innerHTML += `${content}`;
    // A for append
  }
}

function dataLoop(mainObject) {
  displayHTML('.js-search-result-div', `<p>${mainObject.resultCount} result(s)</p>`, "a");

  displayHTML('.js-search-result-div', `<hr>`, "a");

  const resultList = mainObject.results;

  for (let objectInList of resultList) {
    const resultLink = `music-view/artist?id=${objectInList.artistId}`
    //const resultLink = `/artist?id=${objectInList.artistId}`

    displayHTML('.js-search-result-div', `<a href=${resultLink}>${objectInList.artistName}</a>`, "a");

    if (objectInList.primaryGenreName !== undefined) {
      displayHTML('.js-search-result-div', `<p>Genre: ${objectInList.primaryGenreName}</p>`, "a");
    }

    displayHTML('.js-search-result-div', `<p>ID: ${objectInList.artistId}</p>`, "a");

    displayHTML('.js-search-result-div', `<br>`, "a");

    // console.log(objectInList);
  }

  // console.log(mainObject);
  // console.log(resultList);
}

function modeSwitch() {
  const modeButton = document.querySelector('.dark-mode-button')

    if (modeButton.textContent === "Dark Mode") {
      modeButton.textContent = "Light Mode";
    } else {
      modeButton.textContent = "Dark Mode";
    }

    document.body.classList.toggle("body-dark-mode");
}