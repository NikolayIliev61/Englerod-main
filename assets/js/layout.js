const header = document.querySelector('#header');

header.innerHTML += `

<div class = 'logo'>
    <a href='index.html'><img class='logo-img' src="assets/image/logo.png"></a>
</div>
<div class="hamburger" id='hamburgerBtn'>
    <div class="line line-one"></div>
    <div class="line line-two"></div>
    <div class="line line-three"></div>
</div>

<ul class= 'nav-top' id='navTop'>
    <li><a href='#'><i id='blogArrow' class="fas fa-chevron-right fa-1.5x"></i> HOME</a></li>
    <li><a href='#'><i id='blogArrow' class="fas fa-chevron-right fa-1.5x"></i> RECIPES</a></li>
    <li><a href='#'><i id='blogArrow' class="fas fa-chevron-right fa-1.5x"></i> FOOD PREP</a></li>
    <li><a href='#'><i id='blogArrow' class="fas fa-chevron-right fa-1.5x"></i> GARDENING</a></li>
    <li><a href='#'><i id='blogArrow' class="fas fa-chevron-right fa-1.5x"></i> COOK BOOKS</a></li>
    <li><a href='#'><i id='blogArrow' class="fas fa-chevron-right fa-1.5x"></i> ABOUT ENGLEROD</a></li>
</ul>
`;

document.querySelector('#hamburgerBtn').addEventListener('click', ()=>{
    document.querySelector('#navTop').classList.toggle('show-navigation')
    document.querySelector('.line-one').classList.toggle('rotate-line-one')
    document.querySelector('.line-two').classList.toggle('hidden')
    document.querySelector('.line-three').classList.toggle('rotate-line-three')
});



