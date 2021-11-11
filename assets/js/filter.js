const apiURL = 'http://nikolayiliev.dk/wp-json/wp/v2/';
const apiCredentials = 
{
    "username": "api.user",
    "password": "API-key-1234#!"
};

let filteredRecipesObj = JSON.parse(localStorage.getItem('filteredRecipes'));
console.log(filteredRecipesObj)

function createFilteredPage(){
    // parse the itesm from the local storage back to JSON format

    let filteredBody = document.querySelector('.filtered-body')

    window.addEventListener('load', ()=>{
        filteredBody.innerHTML = `
        <div>
            ${insertFilteredRecipe()}
        </div>
    
    `
    })
}

createFilteredPage()

function insertFilteredRecipe(){
    let inserter = '';
    for(const[key,value] of Object.entries(filteredRecipesObj)){
        inserter += `
        <figure>
        <img class="image-figure" onClick='getPageByID(this.id)' style="width:${window.innerWidth}px; height: 250px; object-fit:cover;" src= "${value.acf.image.url}">
        <figcaption class = 'recipe-title' >${value.acf.title}</figcaption>
        <p class='separator'></p>
        <ul>${loadFilters (value)}</ul>
        </figure>
        `;
    }
    return inserter;
}

function loadFilters (data){
    let filters = data.acf.tag_name;
    let filterArr = filters.split(',');

    let inserter = '';
    for(const[key,value] of Object.entries(filterArr)){
        inserter += `
        <li><a href='#'>#${value}</a></li>
        `;
    }
    return inserter;
}
