//player FACTORY===================================
const playerFactory = function (name, sign) {
    const sayHello = function () {
        console.log("Hello! I am " + name + ". I win!");
        return "Hello! I am " + name + ". I win!";
    };
    this.wins = 0;
    return { name, sign, wins, sayHello };
};

// Initialize player objects
const human = playerFactory("Human", "X");
const ai = playerFactory("AI", "O");

// game MODULE======================================
const game = (() => {
    // store whether game is over
    let gameOver = false;
    // keep track of whether it is human player's turn
    let turn = true;
    // game title / turn tracker header
    const header = document.querySelector("h1");
    const turnText = document.createElement("p");
    turnText.textContent = "turn";
    const thinkingText = document.createElement("p");
    thinkingText.textContent = "thinking";
    // win counters
    const winCounters = document.getElementsByClassName("winCounter");

    // function to change whose turn it is
    const switchTurn = function () {
        if (this.turn) {
            this.turn = false;
            header.textContent = ai.name + "'s";
            header.appendChild(thinkingText);
        } else {
            this.turn = true;
            header.textContent = human.name + "'s";
            header.appendChild(turnText);
        }
    };

    // check for a game winner, enable resetting game
    const checkWin = function (board, player) {
        const modal = document.getElementById("outcomeModal");
        const modalContent = document.querySelector(".modal-content");
        const gameWinner = document.getElementById("winner");
        const winMsg = document.getElementById("winnerMsg");
        // reset game button
        const replay = document.querySelector(".replay");
        replay.addEventListener("click", () => {
            gameBoard.newBoard();
            game.turn = true;
            header.textContent = "Here we go again..";
            modal.style.display = "none";
            game.gameOver = false;
        });

        // function to celebrate a round win, pop up the modal
        const winnerStuff = (roundWinner) => {
            console.log(roundWinner.name + " wins!");
            gameWinner.textContent = roundWinner.name;
            winMsg.textContent = '"' + roundWinner.sayHello() + '"';
            modalContent.classList.add("modal-content-active");
            modal.style.display = "block";
            game.gameOver = true;
            roundWinner.wins++;
        };

        if (
            (board[0] == player.sign &&
                board[1] == player.sign &&
                board[2] == player.sign) ||
            (board[3] == player.sign &&
                board[4] == player.sign &&
                board[5] == player.sign) ||
            (board[6] == player.sign &&
                board[7] == player.sign &&
                board[8] == player.sign) ||
            (board[0] == player.sign &&
                board[3] == player.sign &&
                board[6] == player.sign) ||
            (board[1] == player.sign &&
                board[4] == player.sign &&
                board[7] == player.sign) ||
            (board[2] == player.sign &&
                board[5] == player.sign &&
                board[8] == player.sign) ||
            (board[0] == player.sign &&
                board[4] == player.sign &&
                board[8] == player.sign) ||
            (board[2] == player.sign &&
                board[4] == player.sign &&
                board[6] == player.sign)
        ) {
            winnerStuff(player);
            return true;
        } else {
            return false;
        }
    };

    // return
    return {
        turn,
        switchTurn,
        checkWin,
        gameOver,
    };
})();

//gameboard MODULE ============================================
const gameBoard = (() => {
    const cells = document.querySelectorAll(".cell");
    const cellArray = Array.from(cells);
    let currentBoard = [];
    for (let i = 0; i < cellArray.length; i++) {
        currentBoard[i] = cellArray[i].textContent;
    }
    console.log(currentBoard);

    // function to reset the board
    const newBoard = function () {
        cells.forEach((cell) => {
            cell.textContent = "";
        });
        currentBoard = [];
        for (let i = 0; i < cellArray.length; i++) {
            currentBoard[i] = "";
        }
        console.log("a")
    };

    // function to check whether the current cell is full
    const fullCell = (currentCell) => currentCell.textContent != "";
    // function to check whether all cells are full (terminal state)
    const allCellsFull = () => {
        return cellArray.every(fullCell);
    };

    // add functionality to each cell
    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (
                game.turn == true &&
                cell.textContent == "" &&
                easyAI.aiThinking == false
            ) {
                console.log("Human plays on cell " + cell.id);
                currentBoard[cell.id - 1] = human.sign;
                console.log(currentBoard);
                cell.textContent = human.sign;
                game.checkWin(currentBoard, human);
                if (!game.gameOver) {
                    game.switchTurn();
                }
            } else if (
                game.turn == false &&
                cell.textContent == "" &&
                easyAI.aiThinking == false
            ) {
                console.log("AI plays on cell " + cell.id);
                currentBoard[cell.id - 1] = ai.sign;
                console.log(currentBoard);
                cell.textContent = ai.sign;
                game.checkWin(currentBoard, ai);
                if (!game.gameOver) {
                    game.switchTurn();
                }
            }
        });
    });

    return {
        newBoard,
        allCellsFull,
        cellArray,
        currentBoard,
    };
})();

// AI module
const easyAI = (() => {
    let aiThinking = false;
    const aiPlay = () => {
        // create an array of all remaining empty cells
        const emptyCells = gameBoard.cellArray.filter(
            (n) => n.textContent == ""
        );
        // pick a random cell from emptyCells array and click it
        const aiPick = Math.floor(Math.random() * emptyCells.length);
        if (game.turn == false && game.gameOver == false) {
            easyAI.aiThinking = true;
            setTimeout(function () {
                easyAI.aiThinking = false;
                emptyCells[aiPick].click();
            }, 750);
        }
    };
    const scoreBoardNames = () => {
        const scoreNames = document.getElementsByClassName("scoreName");
        scoreNames[0].textContent = human.name + ":";
        scoreNames[1].textContent = ai.name + ":";
    };
    scoreBoardNames();
    return {
        aiPlay,
        aiThinking,
    };
})();
