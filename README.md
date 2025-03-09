![Static Badge](static/badges/HTML5.svg)   
![Static Badge](static/badges/JavaScript.svg)   
![Static Badge](static/badges/Python.svg)   
![Static Badge](static/badges/SASS.svg)   

![Static Badge](static/badges/NVM.svg)   
![Static Badge](static/badges/NPM.svg)   
![Static Badge](static/badges/NodeJS.svg)   

<div id="top"></div>

# Menu   

1. **[Informations générales](#informations-générales)**   
2. **[Interface de l'application](#interface-application)** 
3. **[Liste pré-requis](#liste-pre-requis)**   
4. **[Télégarchement et installation de l'API](#telechargement-installation)**   
5. **[Création environnement virutel](#creation-environnement)**   
6. **[Activation environnement virutel](#activation-environnement)**   
7. **[Lancement de l'API](#lancement-api)**   
8. **[Lancement de l'interface web](#lancement-interface)**   
9. **[Informations importantes sur les différents fichiers et dossiers](#informations-importantes)**   
10. **[Auteurs et contact](#auteur-contact)**   

<div id="informations-générales"></div>

### Développez une interface utilisateur pour une application web JavaScript   

- Projet de création d'une interface web utilisant l'API **"OCMovies-API"** permettant d'afficher   
  le meilleur film selon le score  du site **IMDB**.   
  L'interface utilise une structure **HTML** ainsi qu'une strucuture sass pour la partie css et un code **JavaScript**.   

- L'interface est fonctionnelle, elle présente plusieurs catégories de films, un clic sur un film permet d'afficher   
  dans une fenêtre modale l'image du film et ses informations.   
- Pour utiliser cette interface web, il est nécessaire de lancer l'API **"OCMovies-API"**.   
 
- la structure **SASS** est architecturé et construit sur le design pattern 7-1.   

--------------------------------------------------------------------------------------------------------------------------------

<div id="interface-application"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Interface de l'application   

- L'application est exécutée dans une page web.   

<style>
    .custom-hr {
        width: 50%;
        height: 2px;
        background-color: white;
        border: none;
        margin: 20px auto;
    }
</style>

<div style="display: flex; justify-content: flex-start; margin: 20px 0;">
    <div style="border: 5px solid #8d8d8d; border-radius: 5px; padding: 10px; padding-bottom: 2px; display: inline-block; margin-right: 10px; margin-left: 20px;">
        <img src="/static/img/screen_1.png" alt="Screen globe" style="width: 1200px; height: auto;">
    </div>
</div>

<hr class="custom-hr">

<div style="display: flex; justify-content: flex-start; margin: 20px 0;">
    <div style="border: 5px solid #8d8d8d; border-radius: 5px; padding: 10px; padding-bottom: 2px; display: inline-block; margin-right: 10px; margin-left: 20px;">
        <img src="/static/img/screen_2.png" alt="Screen globe" style="width: 1200px; height: auto;">
    </div>
</div>

<hr>

<div style="display: flex; justify-content: flex-start; margin: 20px 0;">
    <div style="border: 5px solid #8d8d8d; border-radius: 5px; padding: 10px; padding-bottom: 2px; display: inline-block; margin-right: 10px; margin-left: 20px;">
        <img src="/static/img/screen_3.png" alt="Screen globe" style="width: 1200px; height: auto;">
    </div>
</div>

--------------------------------------------------------------------------------------------------------------------------------

<div id="liste-pre-requis"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Liste pré-requis   

Interface élaborée avec les logiciels suivants:   
- **Python** v3.7.2 choisissez la version adaptée a votre ordinateur et système.   
  **Python** est disponible à l'adresse suivante ➔ https://www.python.org/downloads/   
- API **"OCMovies-API"**   
- Sublime Text 3.2.2 build 3211   
- **Nodejs** V12.18.1   
- **SASS** V1.58.3   
- **NVM** V1.10.0   
- **NPM** V6.14.5   
- **Cmder** v1.3.19.1181 : remplace le cmd par défaut de Windows (optionnel)   
- **Windows** 7 professionnel SP1   

| - Les scripts **Python** s'exécutent depuis un terminal.                                            |
------------------------------------------------------------------------------------------------------|
| - Pour ouvrir un terminal sur **Windows**, pressez la touche ```windows + r``` et entrez ```cmd```. |
| - Sur **Mac**, pressez la touche ```command + espace``` et entrez ```terminal```.                   |
| - Sur **Linux**, vous pouvez ouvrir un terminal en pressant les touches ```Ctrl + Alt + T```.       |


--------------------------------------------------------------------------------------------------------------------------------

<div id="telechargement-installation"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Télégarchement et installation de L'API "OCMovies-API"   

- L'installation et des informations sur le fonctionnement de l'API **"OCMovies-API"** se trouvent à l'adresse suivante.      
  ➔ https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR   

--------------------------------------------------------------------------------------------------------------------------------

<div id="creation-environnement"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Création de l'environnement virtuel pour l'API   

- Installer une version de **Python** compatible pour votre ordinateur.   
- Une fois installer ouvrir le cmd (terminal) placer vous dans le dossier principal (dossier racine).   

**Taper dans votre terminal :**   

```bash  
$ python -m venv env
```  
Un répertoire appelé ``env`` doit être créé.   

--------------------------------------------------------------------------------------------------------------------------------


<div id="activation-environnement"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Activation de l'environnement virtuel pour l'API   

- Placez-vous avec le terminal dans le dossier principale (dossier racine).   

**Pour activer l'environnement virtuel créé, il vous suffit de taper dans votre terminal :**   

```bash 
$ env\Scripts\activate.bat
```   

- Ce qui ajoutera à chaque ligne de commande de votre terminal (env):   

**Pour désactiver l'environnement virtuel, il suffit de taper dans votre terminal :**   

```bash  
$ deactivate
```   

--------------------------------------------------------------------------------------------------------------------------------

<div id="lancement-api"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Lancement de l'API   

- Pour utiliser et exécuter l'API activer l'environnement virtuel.   
- Ensuite.   

**Taper dans votre terminal la commande :**   

```bash
$ python manage.py runserver
```   

--------------------------------------------------------------------------------------------------------------------------------

<div id="lancement-interface"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Lancement de l'interface web   

- Pour lancer l'interface web ouvrir le fichier ``index.html`` ➔ [index.html](index.html) dans le navigateur de votre choix.   
 
>_**Note :** Fonctionne sur les navigateurs Firefox et Google Chrome._   

--------------------------------------------------------------------------------------------------------------------------------

<div id="informations-importantes"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Informations importantes sur les différents fichiers et dossiers   

- ``main.js`` ➔ [main.js](js/main.js)   
    - Contient tout le code **JavaScript**. Il est appelé dans le fichier ```index.html``` avec la commande suivante :   

    ```html
    <script src="js/main.js" async></script>   
    ```   
    - Ce fichier contient tous les processus de traitement des événements et toute la gestion des données. 
    &nbsp;

- ``index.html`` ➔ [index.html](index.html)   
    - Ce fichier contient le code **HTML** de base et toutes les relations de lien nécessaires pour permettre au code de s'exécuter correctement.   
    s'exécuter correctement. Tout comme la commande précédente, il appelle également des fichiers **CSS** et d'autres liens **Javascript**.   

    ```W3C``` renvoie : **Document checking completed. No errors or warnings to show.**   
    &nbsp;

- ``styles.css``➔ [styles.css](css/style.css)   
    - Contient tous les styles du projet.   

        - **W3C CSS renvoie : la validation W3C CSS de style.css (CSS niveau 3 + SVG).**  
        - **Aucune erreur trouvée.**  

        - **Ce document est valide conformément à la recommandation CSS niveau 3 + SVG !**   
    &nbsp;

- ``main.scss`` ➔ [main.css](sass/main.css)   
    - Ce fichier est utilisé pour le style du projet. Ce fichier est compilé par sass et adaptera   
    tout le code en css de base pour que les navigateurs adaptent le style au projet.   
    &nbsp;

- ``Dossier css`` ➔ [css](css)   
    - Le dossier css contient le fichier styles.css qui est rempli avec le fichier compilé mains.scss.   
    &nbsp;

- ``package.json`` ➔ [package.json](package.json)   
    - Contient toutes les configurations du projet, la configurations de sass, les   
    les dépôts, les versions, etc.   

--------------------------------------------------------------------------------------------------------------------------------

<div id="auteur-contact"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Auteur et contact   

Pour toute information suplémentaire, vous pouvez me contacter.   
**Bubhux:** bubhuxpaindepice@gmail.com   
