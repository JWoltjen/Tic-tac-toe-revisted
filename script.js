var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
let drawngames = 0; 
let huPlayerwins = 0; 
let aiPlayerwins = 0; 
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


let playerWins = document.getElementById('huwins')
let aiWins = document.getElementById('aiwins')
let draws = document.getElementById('draws')
const button1 = document.getElementById('player1')
const button2 = document.getElementById('player2')
const button3 = document.getElementById('replay')
button1.addEventListener('click', startGame)
button2.addEventListener('click', startAiGame)
button3.addEventListener('click', restart)

const cells = document.querySelectorAll('.cell');



function hideModal() {
    document.querySelector('.startgame').classList.add('hidden')
}
function showModal() {
    document.querySelector('.startgame').classList.remove('hidden')
}

function displayRecord() {
    draws.innerText = drawngames
    aiWins.innerText = aiPlayerwins
}

function restart() {
    document.querySelector('.endgame').classList.add('hidden')
    showModal(); 
    origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
    displayRecord()
}

function startGame() {
    showModal(); 
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
    hideModal(); 
}

function startAiGame() {
    showModal(); 
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
   hideModal(); 
   turn([0,1,2,3,4,5,7,8,9][Math.floor(Math.random()*9)], aiPlayer)
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
    gameWon.player == huPlayer ? huPlayerwins++ : aiPlayerwins++
    gameWon.player == huPlayer ? localStorage.setItem('huWins', JSON.stringify(huPlayerwins)) : localStorage.setItem('aiWins', JSON.stringify(aiPlayerwins))
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");

}

function declareWinner(who) {
	document.querySelector(".endgame").classList.remove('hidden')
	document.querySelector(".endgame .text").innerText = who;
}

function addScore(){
    if(gameWon.player == huPlayer ? huPlayerwins++ : aiPlayerwins++)
    localStorage.setItem('humanwins', JSON.stringify(huPlayerwins))
    localStorage.setItem('aiwins', JSON.stringify(aiPlayerwins))
}

function emptySquares() {
	return origBoard.filter(squares => typeof squares == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "red";
			cells[i].removeEventListener('click', turnClick, false);
		}
        declareWinner("Tie Game!")
        drawngames++
        localStorage.setItem('drawngames', JSON.stringify(drawngames))
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}