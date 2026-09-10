async function getData() {
  const inputVar = document.querySelector('.js-search-input');
  const artist = inputVar.value;

  displayText('.js-search-result');
  // If a user searches up another artist, clear Artist 1's results

  const url = `https://itunes.apple.com/search?term=${artist}&entity=musicArtist`;

  const response = await fetch(url);

  if (!response.ok) {
    displayText('.js-search-result', `<i> response info: ${response.status} </i>`, "w")

    // If something is wrong, display error code 
  } 

  const result = await response.json();
  // Apple returns a JSON file for lookups that becomes an Object

  dataLoop(result);
}

// MDN's guide to using fetch loops really helped: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

function checkKey(event) {
  displayText('.js-key-result', `<b>press: ${event.key}`, "w")

  if (event.key === 'Enter') {
    displayText('.js-key-result')
    // Clear key press tracker so data is central focus

    getData();
  }
}

function displayText(thing, text="", type="w") {
  // If only the class is set, assume it overwrites data to blank text. 
  // ... this is really helpful to clear text!!

  if (type === "w") {
    document.querySelector(`${thing}`).innerHTML = `<p>${text}</p>`;
    // W for write

  } else if (type === "a") {
    document.querySelector(`${thing}`).innerHTML += `<p>${text}</p>`;
    // A for append
  }
}

function dataLoop(anyObject) {
  for (const value of Object.values(anyObject)) {
  // the key is just result = "{Object}{Object}{Object} etc" so only the objects in the value are needed

    if (typeof value === "undefined" || Array.isArray(value)) {
    // The objects are stored in a list, but we want the individual object

      dataLoop(value);
      // We need to try again until we get the object...
      // So lookup the value (undefined -> list -> object!)

    } else {
      const stringValue = JSON.stringify(value);

      displayText('.js-search-result', `${stringValue}`, "a");
      // Append each Artist result so they aren't overwritten
    }
  }
}