# Menu   
1. **Informations générales**   
2. **Liste pré-requis**   
3. **Création environnement virutel**   
4. **Activation environnement virutel**   
5. **Télégarchement et installation de l'API**   
6. **Lancement de l'API**   
7. **Lancement de l'interface web**   
8. **Informations importantes sur les différents fichiers et dossiers**   
9. **Auteurs et contact**   


## Développez une interface utilisateur pour une application web Python   
- Projet de création d'une interface web utilisant l'API "OCMovies-API" permettant d'afficher   
  le meilleur film selon le score  du site  IMDB.   
  L'interface utilise une structure HTML ainsi qu'une strucuture sass pour la partie css et un code javascript.   

- L'interface est fonctionnelle, elle présente plusieurs catégories de films, un clic sur un film permet d'afficher   
  dans une fenêtre modale l'image du film et ses informations.   
- Pour utiliser cette interface web, il est nécessaire de lancer l'API "OCMovies-API".   
 
- la structure sass est architecturé et construit sur le design pattern 7-1.   

## Liste pré-requis   
Interface élaborée avec les logiciels suivants:   
-Python v3.7.2 choisissez la version adaptée a votre ordinateur et système. Python est disponible à l'adresse   
 suivante https://www.python.org/downloads/   
-API "OCMovies-API"   
-Sublime Text 3.2.2 build 3211   
-Nodejs V12.18.1   
-Sass V1.58.3   
-nvm V1.10.0   
-npm V6.14.5   
-Cmder v1.3.19.1181 : remplace le cmd par défaut de Windows (optionnel)   
-Windows 7 professionnel SP1   

- Les scripts python s'exécutent depuis un terminal.   
- Pour ouvrir un terminal sur Windows, pressez la touche ```windows + r``` et entrez ```cmd```.   
- Sur Mac, pressez la touche ```command + espace``` et entrez ```terminal```.   
- Sur Linux, vous pouvez ouviri un terminal en pressant les touches ```Ctrl + Alt + T```.   

## Création de l'environnement virtuel pour l'API   
-Installer une version de Python compatible pour votre ordinateur.   
-Une fois installer ouvrer le cmd (terminal) placer vous dans le dossier principal (dossier racine).   
**-Taper dans votre terminal:**   
```bash  
python -m venv env
```  
Un répertoire appelé env doit être créé.   

## Activation de l'environnement virtuel pour l'API   
-Placez-vous avec le terminal dans le dossier principale (dossier racine).   
**-Pour activer l'environnement virtuel créé, il vous suffit de taper dans votre terminal:**   
```bash 
env\Scripts\activate.bat
```   
- Ce qui ajoutera à chaque ligne de commande de votre terminal (env):   
- **Pour désactiver l'environnement virtuel, il suffit de taper dans votre terminal:**   
```bash  
deactivate
```   

## Télégarchement et installation de L'API   
-L'installation et des informations sur le fonctionnement de l'API se trouvent à l'adresse suivante   
 https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR   

## Lancement de l'API   
-Pour exécuter l'API activer l'environnement virtuel.   
-Ensuite.   
**-Taper dans votre terminal la commande:**   
```bash
python manage.py runserver
```   

## Lancement de l'interface web   
-Pour lancer le l'interface web ouvrir le fichier index.html dans le navigateur de votre choix.   
   
## Informations importantes sur les différents fichiers et dossiers   
-main.js   
    Contient tout le code javascript. Il est appelé dans le fichier index.html avec la commande suivante :   
    ```python
    <script src="js/main.js" async></script>   
    ```   
    Ce fichier contient tous les processus de traitement des événements et toute la gestion des données.   

-index.html   
    Ce fichier contient le code html de base et toutes les relations de lien nécessaires pour permettre au code de s'exécuter correctement.   
    s'exécuter correctement. Tout comme la commande précédente, il appelle également des fichiers CSS et d'autres liens Javascript.   
    ```W3C``` renvoie : Document checking completed. No errors or warnings to show.   

-styles.css   
    Contient tous les styles du projet.   
    ```W3C CSS``` renvoie : la validation W3C CSS de style.css (CSS niveau 3 + SVG).   
    Aucune erreur trouvée.   
    Ce document est valide conformément à la recommandation CSS niveau 3 + SVG !   

-main.scss   
    Ce fichier est utilisé pour le style du projet. Ce fichier est compilé par sass et adaptera   
    tout le code en css de base pour que les navigateurs adaptent le style au projet.   

-Dossier css   
    Le dossier css contient le fichier styles.css qui est rempli avec le fichier compilé mains.scss.   

-package.json   
    Contient toutes les configurations du projet, la configurations de sass, les   
    les dépôts, les versions, etc.   

## Auteurs et contact   
Pour toute information suplémentaire, vous pouvez me contacter.   
**Bubhux:** bubhuxpaindepice@gmail.com   
