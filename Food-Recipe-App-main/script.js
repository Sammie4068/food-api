const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");
let searchQuery = "";

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  fetchAPI();
});

async function fetchAPI() {
  try {
      const baseURL = `http://localhost:5050/api/v1/${searchQuery.trim()}`;
      const response = await fetch(baseURL);
      const data = await response.json();
      generateHTML(data[0]);
  } catch (err) {
    displayError(searchQuery)
  }
}

function generateHTML(data) {
  let time = Math.floor(data.timers/3600)
  let mins = Math.floor((data.timers % 3600) / 60)
  let estimatedTime = time < 1? mins + " Mins": time + " Hrs+"
  container.classList.remove("initial");
  let generatedHTML = "";
  generatedHTML += `
                <div class="item">
					<img src="${data.food_image}">
					<div class="flex-container">
						<h1 class="title">${data.food_name.replace(
              data.food_name[0],
              data.food_name[0].toUpperCase()
            )} <p class="estimated-Time">Estimated Time: ${estimatedTime}</p></h1>
                       <button class="food_btn" onclick="recipeModal()"> Start Cooking </button>
				</div>
        <h2>INGREDIENTS: ${data.ingredients
          .split(",")
          .map((ing) => ing.replace(ing[0], ing[0].toUpperCase()))
          .join(", ")}</h2>

    `;
  searchResultDiv.innerHTML = generatedHTML;
}

// Cooking modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");

modal.classList.add("hidden");

async function recipeModal() {
  const div = document.createElement("ul");
  div.insertAdjacentHTML(
    "beforeend",
    `<button class="close-modal" onclick="reset()">&times;</button>`
  );
  const baseURL = `http://localhost:5050/api/v1/${searchQuery}`;
  const response = await fetch(baseURL);
  const data = await response.json();

  console.log(data[0].ingredients);
  const instructionsArray = data[0].instructions
    .split(";")
    .map((inst) =>
      inst.trim().replace(inst.charAt(0), inst.charAt(0).toUpperCase())
    );
  const timeArray = data[0].timers.split(",");
  for (let i = 0; i < instructionsArray.length; i++) {
    div.insertAdjacentHTML(
      "beforeend",
      `<li class="list">${instructionsArray[i]}</li>`
    );
  }
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  modal.append(div);

  setTimeout(() => {
    timerOut();
  }, 1000);
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Timer
let displayTimer = document.querySelector(".timer");
async function timerOut() {
  const baseURL = `http://localhost:5050/api/v1/${searchQuery}`;
  const response = await fetch(baseURL);
  const data = await response.json();
  let time = Number(data[0].timers);
  const tick = () => {
    const hour = String(Math.floor(time / 3600)).padStart
    (2,0)
    const min = String(Math.floor((time % 3600) / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    displayTimer.textContent = `${hour} : ${min} : ${sec}`;

    if (time == 0) {
      clearInterval(timer);
      displayTimer.innerHTML = "00 : 00 : 00";
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
}

function reset() {
  clearInterval(timerOut);
  displayTimer.innerHTML = "00 : 00 : 00";
  setTimeout(() => {
    closeModal();
    container.classList.add("initial");
    // searchResultDiv.innerHTML = "";
    // setTimeout(()=> location.reload(), 500)
  }, 500);
}

// Displaying errors 
let error = document.querySelector(".error")
function displayError(searchQuery) {
  const errorMessages = [
    `Sorry, we couldn't find any recipes for ${searchQuery}. Looks like the kitchen gods are being a bit fickle today.`,
    `We searched high and low, but unfortunately, there are no recipes for ${searchQuery} in our database. Looks like it's time to get creative in the kitchen!`,
    `Looks like ${searchQuery} is giving our recipe database a run for its money. We'll keep searching, but in the meantime, maybe try a different ingredient?`,
    `Our recipe database is feeling a bit lonely - it's not finding any matches for ${searchQuery}. Maybe give it some company with another ingredient?`,
    `Oops, it looks like our recipe database is playing hard to get. We'll keep trying to find the perfect recipe for ${searchQuery}.`,
    `We're sorry, but ${searchQuery} is a little too elusive for our recipe database. Looks like we'll need to call in some culinary reinforcements!`,
  ];
  error.classList.remove("hidden");
  const randomIndex = Math.floor(Math.random() * errorMessages.length);
  const errorMessage = errorMessages[randomIndex];
  error.textContent = `${errorMessage}`;
}

// page reload
function reloadPage() {
  location.reload();
}
document.addEventListener('keydown', (event) =>{
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    reloadPage();
    event.preventDefault(); 
  }
});
