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

    // reset game button
    const modal = document.getElementById("outcomeModal");
    const replay = document.querySelector(".replay");
    replay.addEventListener("click", () => {
        gameBoard.newBoard();
        game.turn = true;
        header.textContent = "Here we go again..";
        modal.style.display = "none";
        game.gameOver = false;
    });

    // check for a game winner, enable resetting game
    const checkWin = function (board, player) {
        const modalContent = document.querySelector(".modal-content");
        const gameWinner = document.getElementById("winner");
        const winMsg = document.getElementById("winnerMsg");

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
            // winnerStuff(player);
            return true;
            // } else if (gameBoard.allCellsFull() && !gameOver) {
            //     console.log("Tie!");
            //     gameWinner.textContent = "Nobody";
            //     modalContent.classList.add("modal-content-active");
            //     winMsg.textContent = "";
            //     modal.style.display = "block";
            //     game.gameOver = true;
            //     return false;
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
        console.log("a");
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
                    easyAI.aiPlay();
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
        const originalBoard = gameBoard.currentBoard;
        // var bestSpot = minimax(gameBoard.cellArray, ai);
        bestSpot = minimax(originalBoard, ai);
        console.log(bestSpot);

        if (game.turn == false && game.gameOver == false) {
            easyAI.aiThinking = true;
            setTimeout(function () {
                easyAI.aiThinking = false;
                gameBoard.cellArray[bestSpot.index].click();
            }, 750);
        }

        // if (game.turn == false && game.gameOver == false) {
        //     easyAI.aiThinking = true;
        //     setTimeout(function () {
        //         easyAI.aiThinking = false;
        //         emptyCells[aiPick].click();
        //     }, 750);
        // }
        // console.log(bestSpot);

        function minimax(newBoard, player) {
            // console.log ("ai minimax running. working with board: ");
            // console.log (newBoard);
            // array of all the available spots
            const availSpotsCheck = function (checkBoard) {
                let spots = [];
                for (let i = 0; i < checkBoard.length; i++) {
                    if (
                        checkBoard[i] !== human.sign &&
                        checkBoard[i] !== ai.sign
                    ) {
                        spots.push(i);
                    }
                }
                return spots;
            };

            // const availSpots = newBoard.filter((n) => n == "");
            // console.log ("available spots are");
            const availSpots = availSpotsCheck(newBoard);
            // console.log (availSpots);
            // human is minimizing player / endstate
            if (game.checkWin(newBoard, human)) {
                return { score: -10 };
                // ai is maximizing player / endstate
            } else if (game.checkWin(newBoard, ai)) {
                return { score: 10 };
                // return 0 score if tie endstate
            } else if (availSpots.length == 0) {
                return { score: 0 };
            }

            // if no endstate found, go through all available spots after making move

            // array of all possible moves from here
            let moves = [];
            // for all available spots create a move
            for (let i = 0; i < availSpots.length; i++) {
                let move = {};
                // console.log ("available spot index is " + availSpots[i]);
                move.index = availSpots[i];
                // make the move
                // console.log("making the move. board is now: ")
                newBoard[availSpots[i]] = player.sign;
                // console.log(newBoard);
                // check for endstate after making the move, if not found it will run again
                if (player == ai) {
                    let result = minimax(newBoard, human);
                    move.score = result.score;
                } else {
                    let result = minimax(newBoard, ai);
                    move.score = result.score;
                }

                // unmake the move if no endstate found
                newBoard[availSpots[i]] = "";

                // add this move to the array of possible moves
                moves.push(move);
            }
            // console.log(moves);

            let bestMove;
            if (player == ai) {
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
