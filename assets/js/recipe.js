// function that takes the recipe that was stored in the localStorage and then fills in the HTML page with it 
function createRecipePage(){
    let recipeObj = JSON.parse(localStorage.getItem('recipe'));
    console.log(recipeObj)
    console.log(typeof(recipeObj))
    let recipeBody = document.querySelector('.recipe-body');
    window.addEventListener('load', function(){
        recipeBody.innerHTML = `
            <div class='recipeImg'>
                <img src="${recipeObj[0].acf.image.url}">
            </div>
            <section class= 'recipe-content'>
                <div class= 'recipeTitle'>
                    <h1>${recipeObj[0].acf.title}</h1>
                </div>
                <div>
                    <ul class='recipe-filter'>
                        ${loadFilters(recipeObj[0])}
                    </ul>
                </div>

                <div class='recipe-prep-time'>
                    <div class='recipe-prep-icon'>
                        <span><i class="far fa-clock fa-4x"></i></span>
                    </div>
                    <div class='recipe-times'>
                        <ul>
                            <li>Preparation: ${recipeObj[0].acf.preparation_time}</li>
                            <li>Cooking: ${recipeObj[0].acf.cooking_time} </li>
                            <li>Total: ${recipeObj[0].acf.total_time}</li>
                        </ul>
                    </div>
                </div>


                <div class='recipe-ingredients'>
                    <h2>Ingredients</h2>
                    <input class='input' type="number" value="1">

                    <div>
                        <ul>
                            ${getIngridients(recipeObj[0])}
                        </ul>
                    </div>
                </div>
                <hr>
                <div class='remark'>
                  ${checkForRemark(recipeObj[0])}
                </div>

                <div class='cooking-steps'>
                    <h2>Cooking Steps</h2>

                    <ol>
                        ${getCookingSteps(recipeObj[0])}
                    </ol>
                </div>

                <div class='blog-post'>
                    <span id='arrowHolder' ><i id='blogArrow' class="fas fa-chevron-right fa-2x"></i></span>
                    <h3 class='blog-post-title' id='blogBtn'>Read the blog</h3>
                </div>

                <div class='hidden blog-post-content' id='blogText'>
                    ${recipeObj[0].acf.blog_post}
                </div>

                <div class='comments-section'>
                    <span><i class="far fa-comment-alt fa-3x"></i></span>
                    <h3>Comments:</h3>

                </div>
                <div class='some'>
                    <h4>Follow me:</h4>
                    <ul>
                        <li><a href='https://www.facebook.com/englerod/'><i class="fab fa-facebook fa-4x"></i></a></li>
                        <li><a href='https://www.instagram.com/englerod/'><i class="fab fa-instagram fa-4x"></i></a></li>
                        <li><a href='https://fi.pinterest.com/Englerod/'><i class="fab fa-pinterest fa-4x"></i></a></li>
                        <li><a href='https://www.youtube.com/channel/UC3kes16Ele34lVy-evPEi-g'><i class="fab fa-youtube fa-4x"></i></a></li>
                    </ul>
                </div>
            </section>
        `;
    })
}

createRecipePage();

// function that check if there is a remark/note
    function checkForRemark(data){
        let inserter = '';
        if(data.acf.remark){
            inserter += `
                <p>* Note: ${data.acf.remark}</p>
            `;
        }
        return inserter;
    }

    // in order to avoid creating multiple fields for the cooking steps, we have entered them in the WP as text and separated them by !
    // We could have also created them as list items in WP but that would be more technically requiring from the client if he wants to add/change anything
    function getCookingSteps(data){
        let cookingSteps = data.acf.cooking_steps;
        let cookingStepsArr = cookingSteps.split('!');
    
        let inserter = '';
        for(const[key,value] of Object.entries(cookingStepsArr)){
            inserter += `
            <li>${value}</li>
            `;
        }
        return inserter;
    }
// in order to avoid creating multiple fields for the cooking steps, we have entered them in the WP as text and separated them by !
    // We could have also created them as list items in WP but that would be more technically requiring from the client if he wants to add/change anything
    function getIngridients (data){
        let ingredients = data.acf.ingredience;
        let ingredientsArr = ingredients.split('!');
    
        let inserter = '';
        for(const[key,value] of Object.entries(ingredientsArr)){
            inserter += `
            <li>${value}</li>
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
            <li onClick='getFilterByName(this.innerHTML)'>${value}</li>
            `;
        }
        return inserter;
    }

let recipes = '';

// the below function takes the filter that was clicked and then opens a page with recipes that contain this filter
function getFilterByName(filterName){
    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){

            try{
                // creating empty object to store the recipes which contain the filter name
                let filteredReceipes = [];
                recipes= JSON.parse(this.response);
                recipes.forEach((recipe, index) =>{
                    // if the recipe contains this filter, push it into the empty array
                    if (recipe.acf.tag_name.includes(filterName)){
                        filteredReceipes.push(recipe)
                    }
                });
                console.log(filteredReceipes);
                window.localStorage.clear();
                window.localStorage.setItem('filteredRecipes', JSON.stringify(filteredReceipes));
                window.open('filtered.html', '_self');
            }catch(error){
                errorMessage(`Parsing error: ${error}`)
            }
        }
        if(this.readyState == 4 && this.status >= 400){
            //send error message
            errorMessage('An error has occured, please try again later')
        }
    }


    // we want to send login credentials
    xhttp.open('GET', `${apiURL}posts?status=private&per_page=100`, true)
    // tell the server we are sending the credentials in JSON format
    xhttp.setRequestHeader('Authorization', `Bearer ${window.localStorage.getItem('authToken')}`);
    xhttp.send();
}

// as the HTML loads from the JS file via the request to the server, the below
// code loads faster, therefore we have added a delay of 1second so the HTML manages 
// to load and the below function works
setTimeout(function() {
    document.querySelector('#blogBtn').addEventListener('click', ()=>{
        document.querySelector('#arrowHolder').classList.toggle('rotate');
        document.querySelector('#blogText').classList.toggle('hidden');
    });
}, 1000);

