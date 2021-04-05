// initialisation de toutes les variables
let cardClicked = {
    firstCardClicked: {},
    secondCardClicked: {}
}
let hasClickedCard = false;
let performingAction = false;
let discoveredPairs = 0;
let difficultyLevel = "easy";
let timeCount = difficultyLevel === "easy" ? 300 : 200;
let timeCheck;
const fruits = [...fruitsArray, ...fruitsArray]

// fonction de création des cartes dans le DOM puis de mélange
const createCardsAndShuffle = () => {
    $('#cardcontainer').html('')
    fruits.forEach((fruit, i) => {
        $('#cardcontainer').append(`
            <div id="card${i+1}" class="card" data-fruit=${fruit}></div>
        `)
        $(`#card${i+1}`).click(function(){
            clickOneCard(`card${i+1}`)
        })
    })
    const nodes = $('#cardcontainer').children()
    nodes.each(function(){
        $('#cardcontainer').append(nodes[Math.floor(Math.random() * nodes.length)]);
    })
}

// fonction de réinitialisation des variables à rappeler pour une nouvelle partie ou un changement de difficulté
const initiateGameData = () => {
    createCardsAndShuffle()
    discoveredPairs = 0;
    timeCount = difficultyLevel === "easy" ? 300 : 200;
    hasClickedCard = false;
    performingAction = false;
    cardClicked = {
        firstCardClicked: {},
        secondCardClicked: {}
    }
    $('.card').each(function(i){
        unFlip(`card${i+1}`, null, "#0ddf99")
    }) 
}

// Fonction de click d'une carte
// 1) elle s'exécute une fois que les actions en cours sont terminées 
// 2) elle stock la première carte cliquée 
// 3) elle stock la deuxième carte cliquée et enclenche la compraison de ces deux cartes avec la fonction compareTwoClickedCards()
const clickOneCard = (id) => {

    if($('#start').val() === "Jouer"){
        launchTimer()
    }

    $('#start').val("Réinitialiser")

    if(!performingAction && id !== cardClicked.firstCardClicked.id){

        flip(id, $(`#${id}`).data().fruit, "#FFFFFF")
        
        if(!hasClickedCard){
            hasClickedCard = true;
            cardClicked.firstCardClicked.id = id
            cardClicked.firstCardClicked.fruit = $(`#${cardClicked.firstCardClicked.id}`).data().fruit
        } else {
            hasClickedCard = false;
            cardClicked.secondCardClicked.id = id
            cardClicked.secondCardClicked.fruit = $(`#${cardClicked.secondCardClicked.id}`).data().fruit
            compareTwoClickedCards()
        }

    }

}

// Fonction de comparaison des deux dernières cartes cliquées
// 1) Elle empêche la fonction clickOneCard de se réexecuter avant de finir son travail de comparaison
// 2) Si la paire n'est pas validée : elle retourne les cartes avec unFlip(), soit les deux dernières, soit toutes absolument toutes - selon le niveau de difficulté
// 3) Si la paire est validée, soit on gagne (et on sauvegarde le temps), soit on peut de nouveau cliquer sur deux nouvelles paires avec la fonction clickOneCard()
const compareTwoClickedCards = () => {
    performingAction = true;
    if(cardClicked.firstCardClicked.fruit !== cardClicked.secondCardClicked.fruit){
        setTimeout(() => {

            if(difficultyLevel === "easy"){
                unFlip(cardClicked.firstCardClicked.id, null, "#0ddf99")
                unFlip(cardClicked.secondCardClicked.id, null, "#0ddf99")
            } else {
                $('.card').each(function(i){
                    unFlip(`card${i+1}`, null, "#0ddf99")
                }) 
                discoveredPairs = 0;
            }
                
            cardClicked = {
                firstCardClicked: {},
                secondCardClicked: {}
            }     
            performingAction = false;
        }, difficultyLevel === "easy" ? 1200 : 500);
    } else {
        performingAction = false; 
        discoveredPairs +=1;
        if(discoveredPairs === fruitsArray.length){
            setTimeout(() => {
                saveTime()
                alert("GAGNÉ ! Bravo ! Tu es prêt.e à créer ton propre potager... :D")
                location.reload();
            }, difficultyLevel === "easy" ? 1200 : 500);
        }
    }
}

// Fonction qui simule visuellement (CSS) le fait choisir une carte au clic
const flip = (id, fruit, color) => {
    $(`#${id}`).css("background-image", `url('/images/fruits/${fruit}.png')`);
    $(`#${id}`).css("background-color", `${color}`);
    $(`#${id}`).hide()
    $(`#${id}`).fadeIn()
}

// Fonction qui simule visuellement (CSS) le fait de retourner une/plusieur paire/s non identiques
const unFlip = (id, fruit, color) => {
    $(`#${id}`).css("background-image", `none`);
    $(`#${id}`).css("background-color", `${color}`);
}

// Evènement au clic du bouton "Jouer" 
// 1) Il réinitialise le temps passé + redéclenche le timer avec la fonction launchTimer()
// 2) Il réinitialise les variables
// 3) Il simule visuellement (jQuery) un petit effet de réapparition
$('#start').click(function(){
    clearTimeout(timeCheck);
    timeCheck = timeCount
    initiateGameData()
    launchTimer()
    $('#start').val("Réinitialiser")
    $('#cardcontainer').hide()
    $('#cardcontainer').fadeIn(800)
})

// Evènement qui détecte un changement de valeur du bouton <select> relatif à la difficulté
// 1.1) Il change le niveau de difficulté via la variable difficultyLevel
// 1.2) Précision : la difficulté influe sur le temps plus ou moins long avant d'être écoulé d'une part + retourne la dernière paire incorrecte découverte ou TOUTES les paires y compris celles validées suite à la découverte d'une paire incorrecte
// 2) Il réinitialise le temps passé + redéclenche le timer avec la fonction launchTimer()
// 3) Il réinitialise les variables
// 4) Il simule visuellement (jQuery) un petit effet de réapparition
$('#difficulty').change(function(){
    difficultyLevel = $(this).val()
    clearTimeout(timeCheck);
    timeCheck = timeCount
    initiateGameData()
    launchTimer()
    $('#start').val("Réinitialiser")
    $('#cardcontainer').hide()
    $('#cardcontainer').fadeIn(800)
})

// Fonction qui délenche l'écoulement du temps
// 1) Elle décrémente le temps toutes les secondes d'une seconde
// 2) Elle simule visuellement (CSS) la fluctuation de taille d'une width qui représente le temps qui passe
// 3) Si tout le temps correspondant au niveau de difficulté est écoulé, elle déclenche une alerte d'erreur qui aboutie au rechargement de la page
const launchTimer = () => {
    timeCheck = setTimeout(() => { 
        if(timeCount > 0 && discoveredPairs !== fruitsArray.length){
            timeCount--
            let timeWidth;
            if(difficultyLevel === 'easy'){
                timeWidth = 100 - (timeCount * 100 / 300)
                
            } else {
                timeWidth = 100 - (timeCount * 100 / 200)
            }
            $('#time').css('width', `${timeWidth.toFixed(1)}%`)
            launchTimer()
        }
    }, 1000);
    if(timeCount === 0 && discoveredPairs !== fruitsArray.length){
        alert("Dommage, c'est perdu pour cette partie... Essaye encore !")
        location.reload();
    }
}

// Fonction qui sauvegarde le temps en base de données via le déclenchement de la route /save en methode POST
const saveTime = () => {
    $.post("/save",
        {
            time: difficultyLevel === "easy" ? 300 - timeCount : 200 - timeCount,
        }
    );
}

// Fonction qui récupère les trois meilleurs temps via le déclenchement de la route /bestimes en méthode GET
// 1) Elle récupère les informations relatives aux trois meilleurs temps
// 2) Elle modifie le DOM des trois <span> avec les ids correspondants en fonction de ces trois meilleurs temps
const getBestTimes = () => {
    $.get("/besttimes", function(data, status){
        $('#score1').text(data.bestimes.time1)
        $('#score2').text(data.bestimes.time2)
        $('#score3').text(data.bestimes.time3)
    });
}

// Fonction qui se déclenche quand le document est paré
// 1) Elle réinitialise les variables avec initiateGameData()
// 2) Elle déclenche la fonction getBestTimes() qui modifie le DOM munie des trois meilleurs temps
$(document).ready(function(){
    initiateGameData()
    getBestTimes()
})


