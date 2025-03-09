

class Carousel {

    /**
    * @callback moveCallbacks
    * @param {number} [index] 
    */

    /**
    * @param {HTMElement} [element]
    * @param {Object} [options] 
    * @param {Object} [options.slidesToScroll=1] [Nombre d'éléments à faire défiler]
    * @param {Object} [options.slidesVisible=1] [Nombre d'éléments visible dans un slide]
    * @param {boolean} [options.loop=false] [Doit-ton boucler en fin de carousel]
    * @param {boolean} [options.infinite=false]
    * @param {boolean} [options.pagination=false]
    * @param {boolean} [options.navigation=true]
    */
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
            const image = item.querySelector(".item__image img");
            if (image) {
                image.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const movieId = image.dataset.id;
                    if (movieId) {
                        this.openModal(movieId);
                    } else {
                        console.error("Movie ID is undefined");
                    }
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

    /**
     * Ouvre une modale et affiche les détails d'un film en fonction de son ID.
     * La fonction récupère les données du film via une API, met à jour les éléments de la modale,
     * et gère l'affichage ainsi que la fermeture de la modale.
     *
     * @async
     * @function openModal
     * @param {string} id - L'identifiant unique du film à afficher.
     * @returns {Promise<void>} Ne retourne rien explicitement, mais met à jour le DOM pour afficher la modale.
     * @throws {Error} Si la requête API échoue ou si les données du film ne sont pas valides.
     */
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

            /**
             * Met à jour un élément du DOM avec un contenu donné.
             * Si l'élément n'existe pas, une erreur est loguée dans la console.
             *
             * @function updateElement
             * @param {string} id - L'ID de l'élément à mettre à jour.
             * @param {string} content - Le contenu à insérer dans l'élément.
             */
            const updateElement = (id, content) => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = content;
                } else {
                    console.error(`Element with ID '${id}' not found.`);
                }
            };

            // Mettez à jour les éléments de la modale
            updateElement("headerModal__filmImage", movie.image_url ? `<img src="${movie.image_url}" alt="Best Film Image" />` : "No image available");
            updateElement("headerModal__originalTitle", movie.original_title || "Unknown Title");

            // Mettre à jour le bouton "See on Imdb"
            const btnElement = document.querySelector("#movie__header div .btn");
            if (btnElement) {
                // Si le film a un IMDb ID, on redirige vers la page IMDb du film
                if (movie.imdb_id) {
                    btnElement.setAttribute("href", `https://www.imdb.com/title/${movie.imdb_id}/`);
                } else {
                    // Si pas d'ID IMDb, redirige simplement vers imdb.com
                    btnElement.setAttribute("href", "https://www.imdb.com");
                }
            }

            updateElement("infoModalText__genres", movie.genres ? movie.genres.join(', ') : "N/A");
            updateElement("infoModalText__datePublished", movie.date_published || "Unknown");
            updateElement("infoModalText__rated", movie.rated || "N/A");
            updateElement("infoModalText__imdbScore", movie.imdb_score || "N/A");
            updateElement("infoModalText__directors", movie.directors || "Unknown");

            let formattedActors = Array.isArray(movie.actors) ? movie.actors.join(', ') : "Unknown";
            updateElement("infoModalText__actors", formattedActors);
            updateElement("infoModalText__duration", movie.duration ? movie.duration + " min" : "Unknown");
            updateElement("infoModalText__countries", movie.countries || "Unknown");
            updateElement("infoModalText__worldwideGrossIncome", movie.worldwide_gross_income ? movie.worldwide_gross_income + " $" : "N/A");
            updateElement("infoModalText__longDescription", movie.long_description || "No description available.");

            // Affichez la modale
            if (modal) {
                modal.style.display = "block";
            }

            // Fermez la modale
            if (close) {
                close.onclick = () => (modal.style.display = "none");
            }

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

async function loadResults(url, functionUrl) {
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

function bestFilmResultMainPage(result) {
    document.querySelector("#bestFilm__image").innerHTML = "<img src=" + result.image_url + " alt='Best Film Image' height='250' width='200'/>";
    document.querySelector("#bestFilm__title").innerHTML = result.original_title;
    document.querySelector("#bestFilm__description").innerHTML = result.description;
}

loadResults(bestFilmUrlList, bestFilmUrlFunc);

let btn = document.querySelector("#bestFilm__buttonInfo");
btn.onclick = function () {
    loadResults(bestFilmUrl, FilmResultsModale);
    modal.style.display = "block";
}

/**
 * Met à jour le contenu d'une modale avec les informations d'un film.
 * Cette fonction prend un objet `result` contenant les détails du film et les affiche dans les éléments HTML correspondants.
 * Si une propriété est manquante ou non définie, une valeur par défaut est affichée à la place.
 *
 * @param {Object} result - Un objet contenant les informations du film.
 * @param {string} [result.image_url] - L'URL de l'image du film.
 * @param {string} [result.original_title] - Le titre original du film.
 * @param {string[]} [result.genres] - Un tableau des genres du film.
 * @param {string} [result.date_published] - La date de publication du film.
 * @param {string} [result.rated] - La classification du film (ex: PG-13, R).
 * @param {number} [result.imdb_score] - Le score IMDb du film.
 * @param {string} [result.directors] - Les réalisateurs du film.
 * @param {string[]} [result.actors] - Un tableau des acteurs du film.
 * @param {number} [result.duration] - La durée du film en minutes.
 * @param {string} [result.countries] - Les pays d'origine du film.
 * @param {number} [result.worldwide_gross_income] - Le revenu mondial du film.
 * @param {string} [result.long_description] - La description longue du film.
 * @returns {void} Cette fonction ne retourne rien.
 */
function FilmResultsModale(result) {
    document.querySelector("#headerModal__filmImage").innerHTML =
        result.image_url ? `<img src="${result.image_url}" alt="Best Film Image" />` : "No image available";

    document.querySelector("#headerModal__originalTitle").innerHTML = result.original_title || "Unknown Title";
    document.querySelector("#infoModalText__genres").innerHTML = Array.isArray(result.genres) ? result.genres.join(', ') : "N/A";
    document.querySelector("#infoModalText__datePublished").innerHTML = result.date_published || "Unknown";
    document.querySelector("#infoModalText__rated").innerHTML = result.rated || "N/A";
    document.querySelector("#infoModalText__imdbScore").innerHTML = result.imdb_score || "N/A";
    document.querySelector("#infoModalText__directors").innerHTML = result.directors || "Unknown";

    // Vérifie si result.actors est défini et est un tableau avant d'appliquer join()
    let formattedActors = Array.isArray(result.actors) ? result.actors.join(', ') : "Unknown";
    document.querySelector("#infoModalText__actors").innerHTML = formattedActors;

    document.querySelector("#infoModalText__duration").innerHTML = result.duration ? result.duration + " min" : "Unknown";
    document.querySelector("#infoModalText__countries").innerHTML = result.countries || "Unknown";

    document.querySelector("#infoModalText__worldwideGrossIncome").innerHTML =
        result.worldwide_gross_income ? result.worldwide_gross_income + " $" : "N/A";

    document.querySelector("#infoModalText__longDescription").innerHTML = result.long_description || "No description available.";
}

// Fonction pour fermer la modale
function closeModal() {
    const modal = document.querySelector("#modal");
    modal.style.display = "none";
}

// Ajoute un écouteur d'événements au bouton de fermeture
const closeButton = document.querySelector(".modal__close");
closeButton.addEventListener("click", closeModal);

// Optionnel : Ferme la modale en cliquant en dehors de la modale
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/**
 * Crée un carrousel de films pour une catégorie donnée.
 * La fonction génère une section dans le DOM pour la catégorie, ajoute une navigation,
 * et charge les films correspondants à partir d'une API. Les films sont ensuite affichés
 * dans un carrousel interactif.
 *
 * @param {string} category - La catégorie de films à afficher. Si la catégorie est "Film les mieux notés",
 *                            la fonction charge les films les mieux notés. Sinon, elle filtre par genre.
 * @returns {void} Cette fonction ne retourne rien directement, mais modifie le DOM.
 */
function makeCategoryCarousel(category) {
    // Détermine le genre ou l'identifiant de section en fonction de la catégorie
    const genre = category !== "Film les mieux notés" ? category : '';
    const idSection = genre ? genre : 'bestFilms';

    // Crée une section pour la catégorie et l'ajoute au DOM
    const section = document.createElement('section');
    section.classList.add('category');
    section.id = idSection;
    document.querySelector('#body__blockPage').appendChild(section);

    // Ajoute un lien de navigation pour la catégorie
    const nav = document.createElement('a');
    nav.href = `#${idSection}`;
    nav.textContent = category;
    document.querySelector('#header__navigation').appendChild(nav);

    // Ajoute un titre à la section
    const h1 = document.createElement('h1');
    h1.textContent = category;
    section.appendChild(h1);

    // Crée un conteneur pour le carrousel
    const carouselContainer = document.createElement('div');
    carouselContainer.id = `carousel-${idSection}`;
    section.appendChild(carouselContainer);

    // Détermine l'URL de l'API en fonction du genre
    const filmUrlList = genre
        ? `http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=${genre}`
        : 'http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score';

    // Liste des URLs pour les pages de résultats
    const urlList = [
        `${filmUrlList}&page=1`,
        `${filmUrlList}&page=2`,
        `${filmUrlList}&page=3`
    ];

    // Charge les données des films à partir de l'API
    Promise.all(urlList.map(url => fetch(url).then(response => response.json())))
        .then(pagesData => {
            let films = [];
            // Concatène les résultats des trois pages
            pagesData.forEach(page => {
                films = films.concat(page.results);
            });
            // Limite le nombre de films à 8
            films = films.slice(0, 8);

            // Crée un slide pour chaque film et l'ajoute au carrousel
            films.forEach(film => {
                let slide = document.createElement('div');
                slide.classList.add('item');

                // Conteneur pour l'image du film
                let imageContainer = document.createElement('div');
                imageContainer.classList.add('item__image');
                let img = document.createElement('img');
                img.src = film.image_url;
                img.alt = film.original_title;
                img.dataset.id = film.id;
                imageContainer.appendChild(img);

                // Titre du film (masqué par défaut)
                let titleDiv = document.createElement('div');
                titleDiv.classList.add('item__title');
                titleDiv.style.display = "none";
                titleDiv.textContent = film.original_title;

                // Description du film (masquée par défaut)
                let descDiv = document.createElement('div');
                descDiv.classList.add('item__description');
                descDiv.style.display = "none";
                descDiv.textContent = film.description;

                // Ajoute les éléments au slide
                slide.appendChild(imageContainer);
                slide.appendChild(titleDiv);
                slide.appendChild(descDiv);

                // Ajoute le slide au conteneur du carrousel
                carouselContainer.appendChild(slide);
            });

            // Initialise le carrousel avec les options spécifiées
            new Carousel(carouselContainer, {
                slidesVisible: 7,
                slidesToScroll: 1,
                pagination: true,
                navigation: true,
                infinite: true,
            });
        })
        .catch(err => {
            // Gère les erreurs de chargement des films
            console.error("Erreur lors du chargement des films pour la catégorie", category, err);
        });
}

const categories = [
    "Film les mieux notés",
    "Romance",
    "History",
    "Family"
];

for (let category of categories) {
    makeCategoryCarousel(category);
}
