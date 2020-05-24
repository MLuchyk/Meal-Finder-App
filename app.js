const searchInput = document.getElementById('search');
const submit = document.getElementById('submit');
const searchbtn = document.querySelector('.search-btn');
const random = document.getElementById('random');
const back = document.getElementById('back');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const singleMealEl = document.getElementById('single-meal');
const alert = document.getElementById('alert');


//Event Listeners
submit.addEventListener('submit', searchMeal);
searchInput.addEventListener('keydown', clearAlert);
mealsEl.addEventListener('click', function(e){
    const mealInfo = e.path.find(function(item) {
        if(item.classList) {
            return item.classList.contains('mealImg');
        }else {
            return false;
        }
    });
    if(mealInfo){
        const mealId = mealInfo.getAttribute('data-mealid');
        getMealById(mealId);
    }
});
random.addEventListener('click', randomMeal);
back.addEventListener('click', goBack);


function searchMeal(e) {
    //Clear single meal
    singleMealEl.innerHTML = '';
    //Get search item
    const item = searchInput.value;
    //Display back button
    back.style.display = 'block';

    //Check if empty
    if(item){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search results for '${item}':</h2>`;

            if(data.meals === null) {
                resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
            }else {
                mealsEl.style.display = 'grid';
                mealsEl.innerHTML = data.meals.map(meal =>
                    `<div class="meal">
                        <div class="mealImg"  data-mealID="${meal.idMeal}">
                        <h4>Check It Out</h4>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        </div>
                        <div class="meal-info">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>`
                ).join(' ');
                //Clear search input
                // searchInput.value = '';
                document.querySelector('.overlay').style.opacity = '0.8';
            }
            });
    }else {
      //Display an alert
      alert.style.display = 'block';
      searchInput.classList.add('error-input');
      searchbtn.classList.add('error-btn');
    }

   e.preventDefault();
}

//Fetch meal by ID
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}

//Fetch random meal from API
function randomMeal() {
    //Clear alert
    clearAlert();
    //Clear input field
    searchInput.value = '';

    //Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    back.style.display = 'none';
    document.querySelector('.overlay').style.opacity = '0.8';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then (data => {
        const meal = data.meals[0];
       addMealToDOM(meal);   
    })
}

//Add meal to DOM
function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else {
            break;
        }
    }

    singleMealEl.innerHTML =`
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
           ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
           ${meal.strArea ? `<p>${meal.strArea} Cuisine</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
               ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
    </div>`
    resultHeading.innerHTML = '';
    mealsEl.style.display = 'none';
}

//Go back button
function goBack(){
    const item = searchInput.value;
    if(mealsEl.style.display = 'grid' && singleMealEl.innerHTML === ''){
        mealsEl.style.display = 'none';
        resultHeading.innerHTML = '';
        document.querySelector('.overlay').style.opacity = '0.5';
        searchInput.value = '';
        clearAlert();
    }else{
        mealsEl.style.display = 'grid';
        singleMealEl.innerHTML = '';
        resultHeading.innerHTML = `<h2>Search results for '${item}':</h2>`;
    }
}
        

//Clear alert
function clearAlert(){
    alert.style.display = 'none';
    searchInput.classList.remove('error-input');
    searchbtn.classList.remove('error-btn');
}