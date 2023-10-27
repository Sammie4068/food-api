"use strict";

// const btn = document.querySelector('.btn-country');
const foodContainer = document.querySelector(".foods");

const renderFood = (data) => {
  const ingredients = data.ingredients.split(",");
  console.log(ingredients);
  const html = `
  <article class="food" >
    <img class="food__img" src="${data.food_image}" />
    <div class="food__data">
      <h3 class="food__name">${data.food_name.replace(
        data.food_name[0],
        data.food_name[0].toUpperCase()
      )}</h3>
      <p>
         Ingredients: ${ingredients}
       </p>
      <button class="food_btn"> Start Cooking </button>
    </div>
  </article>`;

  foodContainer.insertAdjacentHTML("beforeend", html);
  foodContainer.style.opacity = 1;
};

const renderError = (msg) => {
  foodContainer.insertAdjacentText("beforeend", msg);
  foodContainer.style.opacity = 1;
};

async function recipes(food) {
  try {
    // Country data
    const res = await fetch(`http://localhost:5050/api/v1/${food}`);
    if (!res.ok) throw new Error(`Problem getting recipe`);
    const data = await res.json();
    renderFood(data[0]);
    console.log(data[0]);
  } catch (err) {
    renderError(`😭${err.message}`);
  }
}
recipes("noodles");
