let input = document.querySelector("#input");
let searchBtn = document.querySelector("#Search");
let apiKey = "523270b9-5387-49ff-879a-bf2e7cbb88fa";
let notFound = document.querySelector(".not__found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();


  // Clear old data 
  audioBox.innerHTML= '';
  notFound.innerText= '';
  defBox.innerText= '';

  // Get input data.

  let word = input.value;

  // call API get data
  if (word === "") {
    alert("Word is required");
    return;
  }

  getData(word);
});

async function getData(word) {
    loading.style.display = "block";
  // Ajax call
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );
  const data = await response.json();

  // if empty result
  //   if the length is zero then it will become false
  if (!data.length) {
    loading.style.display = 'none';
    notFound.innerText = " No result found";
    return;
  }

  // if result is suggestions
  if (typeof data[0] === "string") {
    loading.style.display = 'none';  
    let heading = document.createElement("h3");
    heading.innerText = " Did you mean?";
    notFound.appendChild(heading);

    data.forEach((element) => {
      let suggestions = document.createElement("span");
      suggestions.classList.add("suggested");
      suggestions.innerText = element;
      notFound.appendChild(suggestions);
    });

    return;
  }

  // Result Found
  loading.style.display = 'none';
  let definition = data[0].shortdef[0];
  defBox.innerText = definition;

  // sound
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    // if sound file is available then
    renderSound(soundName);
  }
  console.log(data);
}

function renderSound(soundName) {

  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

  
  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}
