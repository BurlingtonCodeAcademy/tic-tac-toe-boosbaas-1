/**Global variables */

let origBoard;
let squareId;
let cross = '<img src="./images/crosses.png" height="110" width="110" id="x">'
let naught = '<img src="./images/naughts.png" height="110" width="110" id="0">'
let playerX = cross;
let playerO = naught;

const computerPlays = naught;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
//using CSS properties so I can get information from the board.
const cells = document.querySelectorAll('.cell');


/***Human vs computer.  I found the minimax function at FreeCodeCamp */
//Setting up the board, removing any html elements and setting an event listener to check for clicks
function startOnePlayerGame() {
    origBoard = Array.from(Array(9).keys()); //defining the board as an array with a key value for each cell
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false); //once a cell is clicked the false value becomes true and it can't be clicked again
    }
}

//resetting board either at end of game or in the middle. Currently I have two tracks for the games, human vs computer and human vs human
function resetGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].removeEventListener('click', turnClick)
        cells[i].removeEventListener('click', turnClickTwo)
    }

}

//uses the key value of cell to determine whether a play can be made.  Once cell is clicked typeOf changes from number to string.
// logic to check whether it's human or computer turn.
function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, playerX)
        if (!checkWin(origBoard, playerX) && !checkTie()) { turn(bestSpot(), computerPlays) };
    }

}



/**   Each turn the program checks for which cell was clicked, 
 * sets image and checks for a win, squareId comes from the click event in turnClick*/

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) { gameOver(gameWon) }
}

/***in order to check for a winner program uses reduce method on the board to add cell clicked on to empty array
 *then uses a for loop to compare the plays array to the winning combinations. when plays array equals a winning condition
 program stops
 */
function checkWin(board, player) {
    let plays = board.reduce((turnsTaken, whoTookTurn, i) =>
        (whoTookTurn === player) ? turnsTaken.concat(i) : turnsTaken, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}
/**sets styling on end game to declare, returns board to original conditions. */
function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == playerX ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == playerX ? "You win!" : "You lose.");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

/**checking for a tie, if there aren't any empty cells and there isn't a winner, set this display then reset the game. */
function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Cat's Game Meaow!")
        return true;
    }
    return false;
}


/**beginning of computer AI */
function emptySquares() {
    return origBoard.filter(left => typeof left == 'number');
}
/**after human takes turn computer looks for best sport */
function bestSpot() {
    return minimax(origBoard, computerPlays).index;
}

/**function from FreeCodeCamp */
function minimax(newBoard, player) {
    let availSpots = emptySquares();
    if (checkWin(newBoard, playerX)) {
        return { score: -10 };
    } else if (checkWin(newBoard, computerPlays)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == computerPlays) {
            let result = minimax(newBoard, playerX);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, computerPlays);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === computerPlays) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}


/*** Two Player Game, these remove minimax function and set second player as "O"  */


function startTwoPlayerGame() {
    player = playerX
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClickTwo, false);
    }
}


function turnClickTwo(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        if (!checkWinTwo(origBoard, player) && !checkTieTwo())
            turnTwo(square.target.id, player);
    }
    player == playerO ? player = playerX : player = playerO

}


function turnTwo(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWonTwo = checkWinTwo(origBoard, player)
    if (gameWonTwo) gameOverTwo(gameWonTwo)
}


function checkWinTwo(board, player) {
    let plays = board.reduce((turnsTaken, whoTookTurn, i) =>
        (whoTookTurn === player) ? turnsTaken.concat(i) : turnsTaken, []);
    let gameWonTwo
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWonTwo = { index: index, player: player };
            break;
        }
    }
    return gameWonTwo;
}


function gameOverTwo(gameWonTwo) {
    for (let index of winCombos[gameWonTwo.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWonTwo.player == playerX ? "blue" : "yellow";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClickTwo, false);
    }
    declareWinnerTwo(gameWonTwo.player == playerX ? "X's win!" : "O's win!");
}

function declareWinnerTwo(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function checkTieTwo() {
  
    if (emptySquaresTwo().length === 0 ) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClickTwo, false);
        }
        declareWinnerTwo("Cat's Game Meeeow!")
        return true;
    }
    return false;
}


function emptySquaresTwo() {
    return origBoard.filter(left => typeof left == 'number');
}



