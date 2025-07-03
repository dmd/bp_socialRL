// Define an object with session-based image paths
var session_id = null;

async function parseIdfromReferrer(url) {

  console.log("PARSER:: ", url);
  if (!url) return parseIdfromReferrer(window.location.href);

  const parsedUrl = new URL(url);
  let localId = localStorage.getItem("userId");
  let parsedId = parsedUrl.searchParams.get("id");
  let session = parsedUrl.searchParams.get("session");

  // let id = parsedId || localId || generateRandomString();

  let id = parsedId ? parsedId : localId ? localId : generateRandomString();

  let extractedID = extractSessionID(session);
  console.log("ID::", id, session_id, Number(extractedID));
  localStorage.setItem("userId", id);

  session_id = Number(extractedID);
  console.log("SESSION ID:: ", session_id);

  // If the URL doesn't have "id" or "session", update it
  if (!parsedId || !session) {
    updateUrlParams(id, session || "week_1_arm_1");
  }

  return id;
}

// Extact the session ID from the URL
function extractSessionID(str) {
  // Use a regular expression to find the number after 'week_'
  const match = str?.match(/week_(\d+)_/);
  if (match) {
    return match[1]; // Return the captured session ID
  } else {
    return null; // Return null if no match is found
  }
}

// In case u need to add more params to the URL, use this function and pass more params
function updateUrlParams(customId, sessionId) {
  const baseUrl = window.location.origin + window.location.pathname;
  let urlParams = new URLSearchParams(window.location.search);

  urlParams.set("id", customId);
  if (sessionId) {
    urlParams.set("session", sessionId);
  }

  const updatedUrl = `${baseUrl}?${urlParams.toString()}`;
  window.location.href = updatedUrl;
}

function generateRandomString() {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var uniqueChars = [];

  while (uniqueChars.length < 5) {
    var randomIndex = Math.floor(Math.random() * alphabet.length);
    var randomChar = alphabet[randomIndex];

    if (!uniqueChars.includes(randomChar)) {
      uniqueChars.push(randomChar);
    }
  }

  var randomString = uniqueChars.join("");
  return "RANDOM_" + randomString;
}

function updateUrlWithCustomId(customId) {
  var baseUrl = window.location.origin + window.location.pathname;
  var updatedUrl;

  console.log("BASE URL:: ", baseUrl);

  if (window.location.search.indexOf("id=") !== -1) {
    updatedUrl = window.location.href.replace(
      /([?&])id=([^&]*)/,
      "$1id=" + customId
    );
  } else {
    updatedUrl = baseUrl + "?id=" + customId;
  }

  window.location.href = updatedUrl;
}

parseIdfromReferrer(document.referrer);

var imagePaths = {
  1: {
    practice_img_1: "img/pilot_1_1.png",
    practice_img_2: "img/pilot_1_2.png",
    test_img_1: "img/Stim_set1_1.png",
    test_img_2: "img/Stim_set1_2.png",
  },
  2: {
    practice_img_1: "img/pilot_2_1.png",
    practice_img_2: "img/pilot_2_2.png",
    test_img_1: "img/Stim_set2_1.png",
    test_img_2: "img/Stim_set2_2.png",
  },
  3: {
    practice_img_1: "img/pilot_1_1.png",
    practice_img_2: "img/pilot_1_2.png",
    test_img_1: "img/Stim_set3_1.png",
    test_img_2: "img/Stim_set3_2.png",
  },
  4: {
    practice_img_1: "img/pilot_2_1.png",
    practice_img_2: "img/pilot_2_2.png",
    test_img_1: "img/Stim_set4_1.png",
    test_img_2: "img/Stim_set4_2.png",
  },
  5: {
    practice_img_1: "img/pilot_1_1.png",
    practice_img_2: "img/pilot_1_2.png",
    test_img_1: "img/Stim_set5_1.png",
    test_img_2: "img/Stim_set5_2.png",
  },
  6: {
    practice_img_1: "img/pilot_2_1.png",
    practice_img_2: "img/pilot_2_2.png",
    test_img_1: "img/Stim_set6_1.png",
    test_img_2: "img/Stim_set6_2.png",
  },
  7: {
    practice_img_1: "img/pilot_1_1.png",
    practice_img_2: "img/pilot_1_2.png",
    test_img_1: "img/Stim_set1_1.png",
    test_img_2: "img/Stim_set1_2.png",
  },
  8: {
    practice_img_1: "img/pilot_2_1.png",
    practice_img_2: "img/pilot_2_2.png",
    test_img_1: "img/Stim_set2_1.png",
    test_img_2: "img/Stim_set2_2.png",
  },
  9: {
    practice_img_1: "img/pilot_1_1.png",
    practice_img_2: "img/pilot_1_2.png",
    test_img_1: "img/Stim_set3_1.png",
    test_img_2: "img/Stim_set3_2.png",
  },
  10: {
    practice_img_1: "img/pilot_2_1.png",
    practice_img_2: "img/pilot_2_2.png",
    test_img_1: "img/Stim_set4_1.png",
    test_img_2: "img/Stim_set4_2.png",
  },
  11: {
    practice_img_1: "img/pilot_1_1.png",
    practice_img_2: "img/pilot_1_2.png",
    test_img_1: "img/Stim_set4_1.png",
    test_img_2: "img/Stim_set4_2.png",
  },
  12: {
    practice_img_1: "img/pilot_2_1.png",
    practice_img_2: "img/pilot_2_2.png",
    test_img_1: "img/Stim_set6_1.png",
    test_img_2: "img/Stim_set6_2.png",
  },
  // Add more sessions here as needed
};

if (session_id == null) {
  console.log("Session ID is not defined. Please define a session ID.");
}

// Dynamically access the images based on session_id
var practice_img_1 = imagePaths[session_id]?.practice_img_1;
var practice_img_2 = imagePaths[session_id]?.practice_img_2;
var test_img_1 = imagePaths[session_id]?.test_img_1;
var test_img_2 = imagePaths[session_id]?.test_img_2;
