window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Prevent most of sneaky right clicks
// https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event

function displayHTML(thing, content="", type="w") {
  if (type === "w") {
    document.querySelector(`${thing}`).innerHTML = `${content}`;
    // W for write

  } else if (type === "a") {
    document.querySelector(`${thing}`).innerHTML += `${content}`;
    // A for append
  }
}
// Modules didn't work, so for now it is pasted here

async function getData(artistId) {
  const url = `https://itunes.apple.com/lookup?id=${artistId}&entity=song`;

  const response = await fetch(url);

  if (!response.ok) {
    displayHTML('.js-artist-result-div', `<i> response info: ${response.status} </i>`, "w")
  } 

  const result = await response.json();
  dataLoop(result);
}

function dataLoop(mainObject) {
  displayHTML('.js-title-result-div', `<p>${(mainObject.resultCount)} result(s)</p>`, "a")

  displayHTML('.js-title-result-div', `<hr>`, "a");

  const resultList = mainObject.results;

  let startIndex = 0;
  let endIndex = 5;

  let isListen = false;

  displayResult(resultList, startIndex, endIndex, isListen);
}

function displayResult(resultList, startI, endI, isListen) {
  //const audioList = [];
  // audioList can be local because all audio (usually) stops when new page is loaded

  displayHTML('.js-artist-result-div');

  for (let i = startI; i < endI; i++) {
    if (endI > resultList.length) {
      endI = resultList.length;
      document.querySelector('.js-load-button').disabled = true;
    }

    if (resultList[i].wrapperType === "artist") {

      displayHTML('.js-title-result-div', `<p>Name: ${resultList[i].artistName}</p>`, "a");

      if (resultList[i].primaryGenreName !== undefined) {
        displayHTML('.js-title-result-div', `<p>Genre: ${resultList[i].primaryGenreName}</p>`, "a");
      }

      displayHTML('.js-title-result-div', `<p>ID: ${resultList[i].artistId}</p>`, "a");

      displayHTML('.js-title-result-div', `<br>`, "a");

    } else if (resultList[i].wrapperType === "track") {

      const imageUrl = resultList[i].artworkUrl100.replace("100x100bb", "500x500bb");

      const resultIndex = resultList.indexOf(resultList[i])
      // The artist details are index 0

      displayHTML('.js-artist-result-div', `
        <div class="song-div">

          <div class="song-cover-div">
            <img class="song-cover-img" src="${imageUrl}" draggable="false">
          </div>

          <div class="song-result-div">
            <p>Song ${resultIndex}</p>
            <p>${resultList[i].trackName}</p>
            <p>in ${resultList[i].collectionName}</p>

            <audio id="audio-${resultIndex}" onplay="checkAudio(${resultIndex})" src="${resultList[i].previewUrl}" controlsList="nodownload" loading="lazy" preload="none" controls></audio>
          </div>
        
        </div>
      `, "a");

      displayHTML('.js-artist-result-div', `<br>`, "a");
    } 
  }

  if (!isListen) {
    listenToButton(resultList, startI, endI, isListen);
  }
}

function listenToButton(resultList, startI, endI, isListen) {
  // console.log("one time message");

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
    if (id === currentId) {
      currentId.play();

    } else {
      id.pause();
    }
  }
}
// Prevent multiple audio files playing at once
// Because there will be that one person who tries..

// Cannot pass in list due to scope conflicts
// So I can pause every audio that isn't current id!

document.addEventListener("DOMContentLoaded", function () {
  // can't display HTML if it is not loaded yet

  const acceptableChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let isInt = true;

  // Full URL: console.log(document.location);

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
      displayHTML(".js-artist-result-div", "One or more characters is not an int", "w");
    }

  } else {
    displayHTML(".js-artist-result-div", "Wrong type or length", "w");
  }
});