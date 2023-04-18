
//Request fetch
async function loadResults (url, functionUrl) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return functionUrl(data);
    } catch (error) {
        console.log(error.message)
    }
}

//Best film request
let bestFilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score";
let bestFilmUrl;
function bestFilmUrlFunc(result) {
    bestFilmUrl = result.results[0].url;   
    loadResults(bestFilmUrl, bestFilmResultMainPage);
}
function bestFilmResultMainPage(result){
    document.querySelector("#bestFilm__image").innerHTML = "<img src=" + result.image_url + "alt='Best Film Image' height='250' width='200'/>";
    document.querySelector("#bestFilm__title").innerHTML = result.original_title;
    document.querySelector("#bestFilm__description").innerHTML = result.description;
}
loadResults(bestFilmUrlList, bestFilmUrlFunc);
let btn = document.querySelector("#bestFilm__buttonInfo");
btn.onclick = function() {
    loadResults(bestFilmUrl, FilmResultsModale);
    modal.style.display = "block";
}

//Modal Results
function FilmResultsModale(result){
    document.querySelector("#headerModal__filmImage").innerHTML = "<img src=" + result.image_url + "alt='Best Film Image' />";
    document.querySelector("#headerModal__originalTitle").innerHTML = result.original_title;
    document.querySelector("#infoModalText__genres").innerHTML = result.genres;
    document.querySelector("#infoModalText__datePublished").innerHTML = result.date_published;
    document.querySelector("#infoModalText__rated").innerHTML = result.rated;
    document.querySelector("#infoModalText__imdbScore").innerHTML = result.imdb_score;
    document.querySelector("#infoModalText__directors").innerHTML = result.directors;
    document.querySelector("#infoModalText__actors").innerHTML = result.actors;
    document.querySelector("#infoModalText__duration").innerHTML = result.duration + ' min';
    document.querySelector("#infoModalText__countries").innerHTML = result.countries;
    document.querySelector("#infoModalText__worldwideGrossIncome").innerHTML = result.worldwide_gross_income + ' $';
    document.querySelector("#infoModalText__longDescription").innerHTML = result.long_description;
}

//Modal Window
let modal = document.querySelector("#infoModal");
let span = document.getElementsByClassName("modalContent__close")[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Categories
function makeCategory(category) {
    const resultsImagesUrl = [];
    const resultsLinksUrl = [];
    const picturesSlides = [];
    const genre = category !== "Film les mieux notés" ? category : '';
    const idSection = genre ? genre : 'bestFilms';
    const FilmUrlList = genre
        ? `http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=${genre}`
        : 'http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score';

    const section = document.createElement('section');
    section.setAttribute('class', 'category');
    section.setAttribute('id', idSection);
    document.querySelector('#body__blockPage').appendChild(section);

    const nav = document.createElement('a');
    nav.setAttribute('href', `#${idSection}`);
    nav.textContent = category;
    document.querySelector('#header__navigation').appendChild(nav);

    const p = document.createElement('p');
    p.setAttribute('class', 'Category__title');
    p.setAttribute('id', `${idSection}Title`);
    section.appendChild(p);

    const h1 = document.createElement('h1');
    h1.textContent = category;
    document.getElementById(`${idSection}Title`).appendChild(h1);

    const divSlider = document.createElement('div');
    divSlider.setAttribute('id', `${idSection}List`);
    divSlider.setAttribute('class', 'list');
    section.appendChild(divSlider);

    const spanControlPrev = document.createElement('span');
    spanControlPrev.setAttribute('id', `prev${idSection}`);
    spanControlPrev.setAttribute('class', 'category__prev');
    spanControlPrev.textContent = '<';
    divSlider.appendChild(spanControlPrev);

    for (let i = 1; i < 5; i++) {
        const spanSlide = document.createElement('span');
        spanSlide.setAttribute('id', `slide${i}${idSection}`);
        spanSlide.setAttribute('class', `category__slide category__slide${i}`);
        divSlider.appendChild(spanSlide);

        spanSlide.onclick = function () {
          const index = nbSlide + (i - 1);
          const link = index < 7 ? resultsLinksUrl[index] : resultsLinksUrl[0];
          loadResults(link, FilmResultsModale);
          modal.style.display = 'block';
        };
    }

    const spanControlNext = document.createElement('span');
    spanControlNext.setAttribute('id', `next${idSection}`);
    spanControlNext.setAttribute('class', 'category__next');
    spanControlNext.textContent = '>';
    divSlider.appendChild(spanControlNext);

    const urlList = [`${FilmUrlList}&page=1`, `${FilmUrlList}&page=2`];
    getAllUrls(urlList, resultsImagesUrl, resultsLinksUrl, picturesSlides, idSection);

    let nbSlide = 0;
    const changeSlideHandler = direction => {
        nbSlide += direction;
        nbSlide = changeSlide(direction, nbSlide);
        displayPictureSlide(idSection, picturesSlides, nbSlide);
    };

    document.querySelector(`#prev${idSection}`).onclick = () => changeSlideHandler(-1);
    document.querySelector(`#next${idSection}`).onclick = () => changeSlideHandler(1);
}

//Change slide Category
function changeSlide(direction, nbSlide) {
    nbSlide += direction;
    if (window.matchMedia("(max-width: 1280px)").matches) {
        nbSlide = nbSlide < 0 ? 4 : (nbSlide > 4 ? 0 : nbSlide);
    } else {
        nbSlide = nbSlide < 0 ? 3 : (nbSlide > 3 ? 0 : nbSlide);
    }
    return nbSlide;
}

//Request category films
async function getAllUrls(urlList, resultsImagesUrl, resultsLinksUrl, picturesSlides, idSection) {
    try {
        let data = await Promise.all(urlList.map(url => fetch(url).then(response => response.json())));
        data.forEach(element => {
        for (let i = 0; i < 5; i++) {
            resultsImagesUrl.push(element.results[i].image_url);
            resultsLinksUrl.push(element.results[i].url);
        }
    });
    if (resultsImagesUrl.length > 7) {
        resultsImagesUrl.slice(0, 7).forEach(url => picturesSlides.push(`<img src="${url}" alt="Category Film Image"/>`));
    }
    } catch (error) {
        console.log(error);
        throw error;
    }
    displayPictureSlide(idSection, picturesSlides, 0);
}

//Display category films
function displayPictureSlide(idSection, picturesSlides, nbSlide){
    for (let i=1; i<5; i++){
        if (nbSlide + (i - 1) !== 7){
        document.querySelector("#slide"+ i + idSection).innerHTML = picturesSlides[nbSlide + (i - 1)];
        } else {
        document.querySelector("#slide"+ i + idSection).innerHTML = picturesSlides[0];
        }
    }
}

//Generate categories
const categories = [
    "Film les mieux notés",
    "Romance",
    "History",
    "Animation"
];

for (let category of categories) {
    makeCategory(category);
}
