
let favourites = "favouritesList";
let meals = []
let selected;

const search = document.getElementById('search-input');
search.addEventListener("keyup", function () {
    console.log("hi")
    showMealList();
})


document.addEventListener('DOMContentLoaded', function () {
    showMealList();
    console.log("Ho")
});


if (localStorage.getItem(favourites) == null) {
    localStorage.setItem(favourites, JSON.stringify([]));
}

const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}



async function showMealList() {

    const inputValue = document.getElementById("search-input").value;
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealsData = await fetchMealsFromApi(url, inputValue);
    document.getElementById('cardContainer').innerHTML = ''
    let html = '';
    if (mealsData.meals) {
        html = mealsData.meals.map(element => {

            return `
        <div class="card">
        <img src="${element.strMealThumb}"  alt="Image">
        <div class="info">
            <h1>  ${element.strMeal}</h1>
            <p  ${truncate(element.strInstructions, 50)}</p>
            <a onclick="showMealDetails(${element.idMeal}, '${inputValue}')" class="btn">Read More</a>
            <a   onclick="addRemoveToFavList(${element.idMeal})"  class="btn">Add To Favorites</a>
        </div>
    </div>
            `
        }).join('');
        document.getElementById('cardContainer').innerHTML = html;
    }
}

function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}



async function showMealDetails(itemId, searchInput) {

    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealList = await fetchMealsFromApi(searchUrl, searchInput);

    let html = ''
    const mealDetails = await fetchMealsFromApi(url, itemId);
    if (mealDetails.meals) {
        html = `
        
    <h2>Name:<span>${mealDetails.meals[0].strMeal}</span></h2>
    <img class="read-img" src="${mealDetails.meals[0].strMealThumb}"  alt="Image">
    <h3>Category:<span> ${mealDetails.meals[0].strCategory}</span></h3>
    <h3>Ingredients:<span> ${mealDetails.meals[0].strIngredient1},${mealDetails.meals[0].strIngredient2},
    ${mealDetails.meals[0].strIngredient3},${mealDetails.meals[0].strIngredient4}</span></h3>
    <h4>Instruction</h4>
    <p> ${mealDetails.meals[0].strInstructions}</p>
    <a href=${mealDetails.meals[0].strYoutube}>${mealDetails.meals[0].strYoutube}</a>
    
    `
    }




    html = html + '</div>';
    document.getElementById('more').innerHTML = ''
    document.getElementById('more').innerHTML = html;
}



function addRemoveToFavList(id) {

    let db = JSON.parse(localStorage.getItem(favourites));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);
        

    } else {
        db.push(id);
        alert("add to favorites")

    }

    localStorage.setItem(favourites, JSON.stringify(db));
    console.log("Hi")


    showFavMealList()

    // updateTask();
}

async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(favourites));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show.....</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
              
            <li class="food-item">
            <span>
            <h4>
                <strong>Name: </strong>
                
                   ${element.strMeal}
                </span>
</h4>
                <button onclick="addRemoveToFavList(${element.idMeal})" class="fav-rem">Remove</button>

           </li>
                `
            }
        }
    }
    document.getElementById('more').innerHTML = html;
}

function generateOneCharString() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}