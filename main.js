let startGame = document.getElementById("start")
startGame.addEventListener('click', function (event) {
    startGame.disabled = true;
    startGame.innerHTML=("Game On!")
})
/**** when number entered into box, added to first added to crosses then to naughts */
/***need state and switch */
let naughts = document.getElementById("naughts")
let crosses = document.getElementById("crosses")
let naughtsArray = [];
let crossesArray = [];

let boardSquares = document.querySelectorAll('.row')
let testArray = Array.from(boardSquares)
console.log(testArray)
alert("this is testArray" + boardSquares )
let turn = 0

function takingTurns(turn) {
    while (turn < 6) {
        let valueOfTurn = testArray.pop
        if (turn % 2 === 0) {

            naughtsArray.push(valueOfTurn);

        } else {

            crossesArray.push(valueOfTurn);
        }
        turn++
    }

}
takingTurns(turn)
 





