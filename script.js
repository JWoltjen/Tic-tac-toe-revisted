var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
let drawngames = 0; 
let huPlayerwins = 0; 
let aiPlayerwins = 0; 
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	// [6, 7, 8],
	// [10,11,12],
	// [13,14,15],
	// [16,17,18],
	// [20,21,22],
	// [23,24,25],
	// [26,27,28],
	// [0,3,6],
	// [1,4,7],
	// [2,5,8],
	// [10,13,16],
	// [11,14,17],
	// [12,15,18],
	// [20,23,26],
	// [21,24,27],
	// [22,25,28],
	// [06,16,26],
	// [7,17,27],
	// [8,18,28],
	// [3,13,23],
	// [4,14,24],
	// [5,15,25],
	// [0,10,20],
	// [1,11,21],
	// [2,12,22],
	// [0,4,8],
	// [2,4,6],
	// [20,24,28],
	// [22,24,26],
	// [0,13,26],
	// [6,13,20],
	// [12,15,28],
	// [8,15,22],
	// [6,17,28],
	// [8,17,26],
	// [0,11,22],
	// [2,11,20],
	// [10,14,18],
	// [12,14,16],
	// [0,14,28],
	// [2,14,26],
	// [1,14,27],
	// [3,14,25],
	// [5,14,23],
	// [7,14,21]
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
    origBoard = Array.from(Array(27).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
    displayRecord()
}

function startGame() {
	showModal(); 
	console.log("startGame is working")
	origBoard = Array.from(Array(27).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
    hideModal(); 
}

function startAiGame() {
    showModal(); 
	origBoard = Array.from(Array(27).keys());
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
		console.log("turnclick is working")
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
		if (win.every(elem => plays.indexOf(elem) > -1)) {    //THIS IS WHAT IS BREAKING THE LOGIC// 
			gameWon = {index: index, player: player};
			console.log("The checkwin condition has fired")
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
        drawngames++
        console.log("it's a tie")
        localStorage.setItem('drawngames', JSON.stringify(drawngames))
        declareWinner("Tie Game!")
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