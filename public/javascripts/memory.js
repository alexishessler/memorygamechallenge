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

const flip = (id, fruit, color) => {
    $(`#${id}`).css("background-image", `url('/images/fruits/${fruit}.png')`);
    $(`#${id}`).css("background-color", `${color}`);
    $(`#${id}`).hide()
    $(`#${id}`).fadeIn()
}
const unFlip = (id, fruit, color) => {
    $(`#${id}`).css("background-image", `none`);
    $(`#${id}`).css("background-color", `${color}`);
}

$('#start').click(function(){
    clearTimeout(timeCheck);
    timeCheck = timeCount
    initiateGameData()
    launchTimer()
    $('#start').val("Réinitialiser")
    $('#cardcontainer').hide()
    $('#cardcontainer').fadeIn(800)
})

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

const saveTime = () => {
    $.post("/save",
        {
            time: difficultyLevel === "easy" ? 300 - timeCount : 200 - timeCount,
        }
    );
}

const getBestTimes = () => {
    $.get("/besttimes", function(data, status){
        $('#score1').text(data.bestimes.time1)
        $('#score2').text(data.bestimes.time2)
        $('#score3').text(data.bestimes.time3)
    });
}

$(document).ready(function(){
    initiateGameData()
    getBestTimes()
})


