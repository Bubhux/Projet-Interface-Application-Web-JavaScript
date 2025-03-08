

class Carousel {

    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
            pagination: false,
            navigation: true,
            infinite: false
        }, options)
        if (this.options.loop && this.options.infinite) {
            throw new Error('Un carousel ne peut pas être à la fois en boucle et en infinie')
        }

        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallbacks = []
        this.offset = 0

        // Modification du DOM
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)

        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')

            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        if (this.options.infinite) {
            this.offset = this.options.slidesVisible + this.options.slidesToScroll
            if (this.offset > children.length) {
                console.error("Vous n'avez pas assez d'élément dans le carousel", element)
            }
            this.items = [
                ...this.items.slice(this.items.length - this.offset).map(item => item.cloneNode(true)),
                ...this.items,
                ...this.items.slice(0, this.offset).map(item => item.cloneNode(true))
            ]
            this.gotoItem(this.offset, false)
        }
        this.items.forEach(item => this.container.appendChild(item))

        this.setStyle()
        if (this.options.navigation) {
            this.createNavigation()
        }
        if (this.options.pagination) {
            this.createPagination()
        }

        // Événements
        this.moveCallbacks.forEach(cb => cb(this.currentItem))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev()
            }
        })

        if (this.options.infinite) {
            this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
        }

        // Ajout des événements pour ouvrir la modale
        this.items.forEach((item) => {
            const image = item.querySelector(".item__image");
            if (image) {
                image.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const movieId = image.dataset.id; // Supposons que l'ID du film est stocké en data-id
                    this.openModal(movieId);
                });
            }
        });
    }


    /**
     * Applique les bonnes dimensions aux éléments du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }


    /**
     * Crée les flèches de navigation
     */
    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }

        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }

            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }


    /**
     * Crée la pagination dans le DOM
     */
    createPagination() {
        let pagination = this.createDivWithClass('carousel__pagination')
        let buttons = []
        this.root.appendChild(pagination)
        for (let i = 0; i < (this.items.length - 2 * this.offset); i = i + this.options.slidesToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button')
            button.addEventListener('click', () => this.gotoItem(i + this.offset))
            pagination.appendChild(button)
            buttons.push(button)
        }
        this.onMove(index => {
            let count = this.items.length - 2 * this.offset
            let activeButton = buttons[Math.floor((index - this.offset) % count / this.options.slidesToScroll)]
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
                activeButton.classList.add('carousel__pagination__button--active')
            }
        })
    }


    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll)
    }


    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }


    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index
     * @param {boolean} [animation = true]
     */
    gotoItem(index, animation = true) {
        if (index < 0) {
            if (this.options.loop) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }

        } else if (index >= this.items.length || this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem) {
            if (this.options.loop) {
                index = 0
            } else {
                return
            }

        }

        let transLateX = index * -100 / this.items.length
        if (animation === false) {
            this.container.style.transition = 'none'
        }
        this.container.style.transform = 'translate3d(' + transLateX + '%, 0, 0)'
        this.container.offsetHeight // Force repaint
        if (animation === false) {
            this.container.style.transition = ''
        }
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }


    /**
     * Déplace le container pour donner l'impression d'un slide infini
     */
    resetInfinite() {
        if (this.currentItem <= this.options.slidesToScroll) {
            this.gotoItem(this.currentItem + (this.items.length - 2 * this.offset), false)
        } else if (this.currentItem >= this.items.length - this.offset) {
            this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false)
        }
    }


    async openModal(id) {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/titles/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const movie = await response.json();

            let modal = document.getElementById("modal");
            let close = document.querySelector(".modal__close");

            if (!movie) {
                console.error("Movie data not found.");
                return;
            }

            document.getElementById("movie__image").setAttribute("src", movie.image_url || "");
            document.getElementById("movie__title").innerText = movie.title || "Unknown Title";
            document.querySelector("#movie__header div .btn").setAttribute(
                "href",
                movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}/` : "#"
            );

            document.getElementById("genre").innerHTML = `<span><b>Genre: </b></span>${movie.genres?.join(', ') || "N/A"}`;
            document.getElementById("date").innerHTML = `<span><b>Release date: </b></span>${movie.date_published || "Unknown"}`;
            document.getElementById("rated").innerHTML = `<span><b>Rated: </b></span>${movie.rated || "N/A"}`;
            document.getElementById("imdb_score").innerHTML = `<span><b>IMDB Score: </b></span>${movie.imdb_score || "N/A"}`;
            document.getElementById("director").innerHTML = `<span><b>Director: </b></span>${movie.directors?.join(', ') || "Unknown"}`;
            document.getElementById("actors").innerHTML = `<span><b>Actors: </b></span>${movie.actors?.join(', ') || "Unknown"}`;
            document.getElementById("duration").innerHTML = `<span><b>Duration: </b></span>${movie.duration ? movie.duration + " min" : "Unknown"}`;
            document.getElementById("country").innerHTML = `<span><b>Country: </b></span>${movie.countries?.[0] || "Unknown"}`;
            document.getElementById("box-office").innerHTML = `<span><b>Box Office results: </b></span>${movie.worldwide_gross_income || "N/A"} $`;
            document.getElementById("description").innerHTML = `<span><b>Description: </b></span>${movie.long_description || "No description available."}`;

            modal.style.display = "block";

            close.onclick = () => (modal.style.display = "none");

            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };

            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    modal.style.display = "none";
                }
            });

        } catch (error) {
            console.error("Error fetching movie data:", error);
        }
    }    


    /**
     * Ajoute une fonction de rappel qui est exécutée à chaque déplacement du carousel.
     * @param {function} cb Callback
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }


    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(cb => cb(0))
        }
    }


    /**
     * Crée un élément div avec une classe donnée.
     * @param {string} classename
     * @returns {HTMLElement}
     */
    createDivWithClass(classename) {
        let div = document.createElement('div')
        div.setAttribute('class', classename)
        return div
    }

    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }


    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}


/**********************************
 *   MODALE DU CAROUSEL (ID "modal")
 **********************************/
const modal = document.querySelector('#modal')
if (modal) {
    const modalClose = modal.querySelector('.modal__close')
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('modal--visible')
        })
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('modal--visible')
        }
    })
}

/**********************************
 *       FONCTIONS BEST FILM
 **********************************/
async function loadResults (url, functionUrl) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return functionUrl(data);
    } catch (error) {
        console.log(error.message)
    }
}

// Requête pour le meilleur film.
let bestFilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1";
let bestFilmUrl;
function bestFilmUrlFunc(result) {
    bestFilmUrl = result.results[0].url;   
    loadResults(bestFilmUrl, bestFilmResultMainPage);
}

function bestFilmResultMainPage(result){
    document.querySelector("#bestFilm__image").innerHTML = "<img src=" + result.image_url + " alt='Best Film Image' height='250' width='200'/>";
    document.querySelector("#bestFilm__title").innerHTML = result.original_title;
    document.querySelector("#bestFilm__description").innerHTML = result.description;
}

loadResults(bestFilmUrlList, bestFilmUrlFunc);

let btn = document.querySelector("#bestFilm__buttonInfo");
btn.onclick = function() {
    loadResults(bestFilmUrl, FilmResultsModale);
    // Affiche la modale associée au meilleur film (celle-ci possède l'ID "modal")
    modal.style.display = "block";
}

function FilmResultsModale(result) {
    document.querySelector("#headerModal__filmImage").innerHTML =
        result.image_url ? `<img src="${result.image_url}" alt="Best Film Image" />` : "No image available";

    document.querySelector("#headerModal__originalTitle").innerHTML = result.original_title || "Unknown Title";
    document.querySelector("#infoModalText__genres").innerHTML = result.genres || "N/A";
    document.querySelector("#infoModalText__datePublished").innerHTML = result.date_published || "Unknown";
    document.querySelector("#infoModalText__rated").innerHTML = result.rated || "N/A";
    document.querySelector("#infoModalText__imdbScore").innerHTML = result.imdb_score || "N/A";
    document.querySelector("#infoModalText__directors").innerHTML = result.directors || "Unknown";

    // Vérifie si result.actors est défini et est un tableau avant d'appliquer join()
    let formattedActors = Array.isArray(result.actors) ? result.actors.join(', ') : "Unknown";
    document.querySelector("#infoModalText__actors").innerHTML = 'Acteurs : ' + formattedActors;

    document.querySelector("#infoModalText__duration").innerHTML = result.duration ? result.duration + " min" : "Unknown";
    document.querySelector("#infoModalText__countries").innerHTML = result.countries || "Unknown";

    document.querySelector("#infoModalText__worldwideGrossIncome").innerHTML =
        result.worldwide_gross_income ? result.worldwide_gross_income + " $" : "N/A";

    document.querySelector("#infoModalText__longDescription").innerHTML = result.long_description || "No description available.";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/**********************************
 *   NOUVELLE FONCTION : makeCategoryCarousel
 *   (Utilise Carousel pour gérer les slides)
 **********************************/
function makeCategoryCarousel(category) {
    const genre = category !== "Film les mieux notés" ? category : '';
    const idSection = genre ? genre : 'bestFilms';

    const section = document.createElement('section');
    section.classList.add('category');
    section.id = idSection;
    document.querySelector('#body__blockPage').appendChild(section);

    const nav = document.createElement('a');
    nav.href = `#${idSection}`;
    nav.textContent = category;
    document.querySelector('#header__navigation').appendChild(nav);

    const h1 = document.createElement('h1');
    h1.textContent = category;
    section.appendChild(h1);

    const carouselContainer = document.createElement('div');
    carouselContainer.id = `carousel-${idSection}`;
    section.appendChild(carouselContainer);

    const filmUrlList = genre
        ? `http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=${genre}`
        : 'http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score';

    const urlList = [
        `${filmUrlList}&page=1`,
        `${filmUrlList}&page=2`,
        `${filmUrlList}&page=3`
    ];

    Promise.all(urlList.map(url => fetch(url).then(response => response.json())))
        .then(pagesData => {
            let films = [];
            pagesData.forEach(page => {
                films = films.concat(page.results);
            });
            films = films.slice(0, 8);

            films.forEach(film => {
                let slide = document.createElement('div');
                slide.classList.add('item');

                let imageContainer = document.createElement('div');
                imageContainer.classList.add('item__image');
                let img = document.createElement('img');
                img.src = film.image_url;
                img.alt = film.original_title;
                img.dataset.id = film.id; // Assurez-vous que film.id est défini
                imageContainer.appendChild(img);

                let titleDiv = document.createElement('div');
                titleDiv.classList.add('item__title');
                titleDiv.style.display = "none";
                titleDiv.textContent = film.original_title;

                let descDiv = document.createElement('div');
                descDiv.classList.add('item__description');
                descDiv.style.display = "none";
                descDiv.textContent = film.description;

                slide.appendChild(imageContainer);
                slide.appendChild(titleDiv);
                slide.appendChild(descDiv);

                carouselContainer.appendChild(slide);
            });

            new Carousel(carouselContainer, {
                slidesVisible: 7,
                slidesToScroll: 1,
                pagination: true,
                navigation: true,
                infinite: true
            });
        })
        .catch(err => {
            console.error("Erreur lors du chargement des films pour la catégorie", category, err);
        });
}

/**********************************
 *      GÉNÉRATION DES CATÉGORIES
 **********************************/
const categories = [
    "Film les mieux notés",
    "Romance",
    "History",
    "Family"
];

for (let category of categories) {
    makeCategoryCarousel(category);
}
