window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Prevent most of sneaky right clicks
// https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event

async function getData(artistId) {
  const url = `https://itunes.apple.com/lookup?id=${artistId}&entity=song&limit=50`;

  const response = await fetch(url);

  if (!response.ok) {
    document.querySelector('.js-artist-result-div').textContent =  `response info: ${response.status}`;
  } 

  const result = await response.json();
  dataLoop(result);
}

function dataLoop(mainObject) {
  const titleDiv = document.querySelector('.js-title-result-div');

  const resultCount = document.createElement("p");
  resultCount.textContent = `${(mainObject.resultCount)} result(s)`;
  titleDiv.appendChild(resultCount);

  titleDiv.appendChild(document.createElement("hr"));

  const resultList = mainObject.results;

  let startIndex = 0;
  let endIndex = 5;

  let isListen = false;

  displayResult(resultList, startIndex, endIndex, isListen);
}

function displayResult(resultList, startI, endI, isListen) {
  // audioList can be local because all audio (usually) stops when new page is loaded

  const resultDiv = document.querySelector('.js-artist-result-div');
  resultDiv.replaceChildren();

  const docFrag = document.createDocumentFragment();

  for (let i = startI; i < endI; i++) {

    if (endI > resultList.length) {
      endI = resultList.length;
      document.querySelector('.js-load-button').disabled = true;
    }

    if (resultList[i].wrapperType === "artist") {

      const titleDiv = document.querySelector('.js-title-result-div');

      const artistName = document.createElement("p");
      artistName.textContent = `Name: ${resultList[i].artistName}`;
      titleDiv.appendChild(artistName);

      if (resultList[i].primaryGenreName !== undefined) {
        const artistGenre = document.createElement("p");
        artistGenre.textContent = `Genre: ${resultList[i].primaryGenreName}`;
        titleDiv.appendChild(artistGenre);
      }

      const artistID = document.createElement("p");
      artistID.textContent = `ID: ${resultList[i].artistId}`;
      titleDiv.appendChild(artistID);

      titleDiv.appendChild(document.createElement("br"));

    } else if (resultList[i].wrapperType === "track") {

      const aloneResult = document.createElement("div");
      docFrag.appendChild(aloneResult);

      const imageUrl = resultList[i].artworkUrl100.replace("100x100bb", "250x250bb");

      const resultIndex = resultList.indexOf(resultList[i]) // The artist details are index 0

      aloneResult.classList.add("song-result");

      // Cover Div

      const songCoverDiv = document.createElement("div");
      songCoverDiv.classList.add("song-cover-div");
      aloneResult.appendChild(songCoverDiv);

      const songCoverImg = document.createElement("img");
      songCoverImg.classList.add("song-cover-img");
      songCoverImg.src = imageUrl;
      songCoverImg.draggable = false;
      songCoverDiv.appendChild(songCoverImg);

      // Result Div

      const songResultDiv = document.createElement("div");
      songResultDiv.classList.add("song-result-div");
      aloneResult.appendChild(songResultDiv);

      const songIndex = document.createElement("p");
      songIndex.textContent = `Song ${resultIndex}`;
      songResultDiv.appendChild(songIndex);

      const songTitle = document.createElement("p");
      songTitle.textContent = resultList[i].trackName;
      songResultDiv.appendChild(songTitle);

      const albumName = document.createElement("p");
      albumName.textContent = `in ${resultList[i].collectionName}`;
      songResultDiv.appendChild(albumName);

      const songAudio = document.createElement("audio");
      songAudio.src = resultList[i].previewUrl;
      songAudio.onplay = function() {checkAudio(resultIndex)};
      songAudio.id = `audio-${resultIndex}`;
      songAudio.controlsList = "nodownload";
      songAudio.preload = "none";
      songAudio.controls = true;
      songResultDiv.appendChild(songAudio);
    } 
  }

  resultDiv.appendChild(docFrag);

  if (!isListen) {
    listenToButton(resultList, startI, endI, isListen);
  }
}

function listenToButton(resultList, startI, endI, isListen) {
  isListen = true;
  // The event listeners shouldn't duplicate as this function can only happen once now

  document.querySelector('.js-load-button').addEventListener("click", function () {

    if (endI <= resultList.length) {
      // I cannot use resultCount here but this still finds length
      // This if means the endIndex is not higher than length so it can load more songs

      startI += 5;
      endI += 5;

      scrollTo(top);
      // Put viewer at top so they can see new songs

      displayResult(resultList, startI, endI, isListen);
    }
  });
}

function checkAudio(index) {
  currentId = document.getElementById(`audio-${index}`);

  listId = Array.from(document.querySelectorAll("audio"));

  for (id of listId) {
    if (id !== currentId) {
      id.pause();

      // There was an infinite loop if I play the audio,
      // because it triggers this function again
    }
  }
}
// Prevent multiple audio files playing at once

// Cannot pass in list due to scope conflicts, so I can pause every audio that isn't current id

document.addEventListener("DOMContentLoaded", function () {
  resultDiv = document.querySelector(".js-artist-result-div");

  const acceptableChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let isInt = true;

  let params = new URLSearchParams(document.location.search);

  let id = params.get("id");

  if ((typeof id === "string") && (id.length > 0)) {

    for (let i = 0; i < id.length; i++) {
      
      if (!acceptableChars.includes(id[i])) {
        isInt = false;
      }
    }

    if (isInt) {
      getData(id);

    } else {
      resultDiv.textContent = "One or more characters is not an int";
    }

  } else {
    resultDiv.textContent = "Wrong type or length";
  }
});