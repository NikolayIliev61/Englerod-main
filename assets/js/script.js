// creating variables to access to WP API
const apiURL = 'http://nikolayiliev.dk/wp-json/wp/v2/';
// variable for credentials used to access the private posts
const apiCredentials = 
{
    "username": "api.user",
    "password": "API-key-1234#!"
};

//Below code servers a purpose to make a POST request to the server using the API and 
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200){
        //checking the readystate and that status of the connection is OK
        try{
            // make the API data we get back into JSON format
            let data = JSON.parse(this.response);
            // save the data to localStorage
            window.localStorage.setItem('authToken', data.token)
            // catching the error and console.log-ing it
        }catch(error){
            errorMessage(`Parsing error: ${error}`)
        }
    }
    //if error occurs send error message
    if(this.readyState == 4 && this.status >= 400){
        
        errorMessage('An error has occured, please try again later.')
    }
}

xhttp.open('POST', 'http://nikolayiliev.dk/wp-json/jwt-auth/v1/token', true)
// tell the server we are sending the credentials in JSON format
xhttp.setRequestHeader('Content-Type', 'application/JSON');
xhttp.send(JSON.stringify(apiCredentials));

// console.log the error message if there is one
function errorMessage(msg) {
    console.log(msg);
}

// the below gets all the posts (recipes) from the WordPress server and is displaying them with the displayPosts function 
function getInfoFromWP(){

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (){
            if(this.readyState == 4 && this.status == 200){

                try{
                    recipes= JSON.parse(this.response);
                    // itterating through all recipes and creating a recipe item for every one of them
                    recipes.forEach(recipe=>{
                        displayPosts(recipe);
                    });
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
    getInfoFromWP();

    // target the HTML section that holds all the recipes
    let imageGallery = document.querySelector('#recipeLibrary');
    // function to display a recipe. IMGes have IDs so that the onClick can refert to it. This is used to then open the dedicated recipe page
    function displayPosts(data){
        imageGallery.innerHTML += `
        <figure>
        <img id="${data.id}" onClick='getPageByID(this.id)' class="image-figure" style="width:${window.innerWidth}px; height: 250px; object-fit:cover;" src= "${data.acf.image.url}">
        <figcaption class = 'recipe-title' >${data.acf.title}</figcaption>
        <p class='separator'></p>
        <ul>${loadFilters (data)}</ul>
        </figure>
        
        `;
    }
    // loading the #-tag filters from the tag_name section of the WP post and iserting them as listitems
    function loadFilters (data){
        // taking all the filters in the tag_name which are separated by comma
        let filters = data.acf.tag_name;
        // pushing them into a variable creating an object of filters by separating them by coma
        let filterArr = filters.split(',');
    
        let inserter = '';
        //as it returns an object we need to itterate over the object and for each create a list item   
        for(const[key,value] of Object.entries(filterArr)){
            inserter += `
            <li><a href='#'>#${value}</a></li>
            `;
        }
        return inserter;
    }

    let recipePost = '';

// this is going to store the recipe that is clicked

function getPageByID(id){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status== 200){
            try{
                recipePost = JSON.parse(xhttp.response);
                console.log('recipePost ready');
                console.log(id);
                console.log(recipePost);
                window.localStorage.setItem('recipe', JSON.stringify(recipePost));
                window.open('recipe.html', '_self');
                createRecipePage();

            }catch(error){
                errorMessage(`error: ${error}`)
            }
            
        }
        if (this.readyState == 4 && this.status >= 400) {
            errorMessage('An error has occured while getting the data. Please try again later!');
        }
    }

    // the below line requests a post that contains the ID value of the clicked recipe
    xhttp.open('GET', `${apiURL}posts?status=private&include[]=${id}`, true);
    xhttp.setRequestHeader('Authorization', `Bearer ${window.localStorage.getItem('authToken')}`);
    xhttp.send();

}

