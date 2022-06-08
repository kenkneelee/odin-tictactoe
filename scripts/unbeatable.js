//player factory===================================
const playerFactory = function (name, sign, winMsg) {
    const sayHello = function () {
        console.log(winMsg);
        return winMsg;
    };
    this.wins = 0;
    return { name, sign, wins, sayHello };
};

// IIFE to setup players and difficulty

const setup = (() => {
    const human = playerFactory("Human", "X", "That's one for humanity!");
    const ai = playerFactory("AI", "O", "The unbeatable AI wins yet again.");

    const setupModal = document.getElementById("setupModal");
    const setupModalContent = document.querySelector(".setupModal-content");

    setupModal.style.display = "block";

    const startGame = document.getElementById("start");
    startGame.addEventListener("click", () => {
        setupModal.style.display = "none";

        const possiblePlayers = [
            {
                name: "caveman",
                sign: "X",
                winMessage: "oogabooga!",
            },
            {
                name: "ninja",
                sign: "X",
                winMessage: "...",
            },
            {
                name: "soldier",
                sign: "X",
                winMessage: "To victory!",
            },
            {
                name: "knight",
                sign: "X",
                winMessage: "Huzzah!",
            },
            {
                name: "easy",
                sign: "O",
                winMessage: "Waaaaaaa!!",
            },
            {
                name: "impossible",
                sign: "O",
                winMessage: "The unbeatable AI prevails yet again!",
            },
        ];
        // initialize human player object
        const humanObject = possiblePlayers.find(
            (player) =>
                player.name ==
                document.querySelector('input[name="humanChoice"]:checked')
                    .value
        );
        console.log(humanObject);

        const humanName = humanObject.name;
        const humanSign = humanObject.sign;
        const humanMessage = humanObject.winMessage;

        setup.human = playerFactory(humanName, humanSign, humanMessage);

        // initialize ai player object
        const aiObject = possiblePlayers.find(
            (player) =>
                player.name ==
                document.querySelector('input[name="aiChoice"]:checked').value
        );
        console.log(aiObject);
        const aiName = aiObject.name;
        const aiSign = aiObject.sign;
        const aiMessage = aiObject.winMessage;

        setup.ai = playerFactory(aiName, aiSign, aiMessage);
        scoreBoardNames();
    });

    // scoreboard and win counters
    const scoreBoardNames = () => {
        const scoreNames = document.getElementsByClassName("scoreName");
        scoreNames[0].textContent = setup.human.name + ":";
        scoreNames[1].textContent = setup.ai.name + ":";
    };

    return {
        human,
        ai,
    };
})();

// game module======================================
const game = (() => {
    // store whether game is over
    let gameOver = false;

    // keep track of whether it is human player's turn
    let turn = true;

    // function to change whose turn it is
    const switchTurn = function () {
        if (this.turn) {
            this.turn = false;
            header.textContent = setup.ai.name + "'s";
            header.appendChild(thinkingText);
        } else {
            this.turn = true;
            header.textContent = setup.human.name + "'s";
            header.appendChild(turnText);
        }
    };

    // game title / turn tracker header
    const header = document.querySelector("h1");
    const turnText = document.createElement("p");
    turnText.textContent = "turn";
    const thinkingText = document.createElement("p");
    thinkingText.textContent = "thinking";

    const winCounters = document.getElementsByClassName("winCounter");
    const updateWins = () => {
        winCounters[0].textContent = setup.human.wins;
        winCounters[1].textContent = setup.ai.wins;
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

    // function to celebrate a round win, pop up the modal
    const modalContent = document.querySelector(".outcomeModal-content");
    const gameWinner = document.getElementById("winner");
    const winMsg = document.getElementById("winnerMsg");

    const winnerStuff = (roundWinner) => {
        console.log(roundWinner.name + " wins!");
        gameWinner.textContent = roundWinner.name;
        winMsg.textContent = '"' + roundWinner.sayHello() + '"';
        modalContent.classList.add("modal-content-active");
        modal.style.display = "block";
        game.gameOver = true;
        roundWinner.wins++;
        game.updateWins();
    };

    // function to declare a round tie, pop up the modal
    const tieStuff = () => {
        console.log("Tie!");
        gameWinner.textContent = "Nobody";
        modalContent.classList.add("modal-content-active");
        winMsg.textContent = "";
        modal.style.display = "block";
        game.gameOver = true;
    };

    // check for a game winner
    const checkWin = function (board, player) {
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
        winnerStuff,
        tieStuff,
        updateWins,
    };
})();

//gameboard module ============================================
const gameBoard = (() => {
    const cells = document.querySelectorAll(".cell");
    const cellArray = Array.from(cells);
    let currentBoard = [];
    for (let i = 0; i < cellArray.length; i++) {
        currentBoard[i] = cellArray[i].textContent;
    }

    // function to reset the board
    const newBoard = function () {
        cells.forEach((cell) => {
            cell.textContent = "";
        });
        gameBoard.currentBoard = [];
        for (let i = 0; i < cellArray.length; i++) {
            gameBoard.currentBoard[i] = "";
        }
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
            // human turn
            if (
                game.turn == true &&
                cell.textContent == "" &&
                unbeatableAI.aiThinking == false
            ) {
                console.log("Human plays on cell " + cell.id);
                gameBoard.currentBoard[cell.id - 1] = setup.human.sign;
                // console.log(gameBoard.currentBoard);
                cell.textContent = setup.human.sign;
                cell.classList.remove("redCell");
                cell.classList.add("blueCell");

                // check for terminal state
                if (
                    game.checkWin(gameBoard.currentBoard, setup.human) == true
                ) {
                    game.winnerStuff(setup.human);
                }
                // tie game
                else if (
                    game.checkWin(gameBoard.currentBoard, setup.human) ==
                        false &&
                    gameBoard.allCellsFull()
                ) {
                    game.tieStuff();
                }
                // if no terminal state, proceed to AI turn
                else {
                    game.switchTurn();
                    unbeatableAI.aiPlay();
                }
            }
            // ai turn
            else if (
                game.turn == false &&
                cell.textContent == "" &&
                unbeatableAI.aiThinking == false
            ) {
                console.log("AI plays on cell " + cell.id);
                gameBoard.currentBoard[cell.id - 1] = setup.ai.sign;
                // console.log(gameBoard.currentBoard);
                cell.textContent = setup.ai.sign;
                cell.classList.remove("blueCell");
                cell.classList.add("redCell");
                // check for terminal state
                if (game.checkWin(gameBoard.currentBoard, setup.ai) == true) {
                    game.winnerStuff(setup.ai);
                }
                // tie game
                else if (
                    game.checkWin(gameBoard.currentBoard, setup.ai) == false &&
                    gameBoard.allCellsFull()
                ) {
                    game.tieStuff();
                } else {
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

// unbeatable AI module
const unbeatableAI = (() => {
    let aiThinking = false;
    const aiPlay = () => {
        originalBoard = gameBoard.currentBoard;
        bestSpot = minimax(originalBoard, setup.ai);
        console.log(bestSpot);

        if (game.turn == false && game.gameOver == false) {
            unbeatableAI.aiThinking = true;
            setTimeout(function () {
                unbeatableAI.aiThinking = false;
                gameBoard.cellArray[bestSpot.index].click();
            }, 750);
        }

        function minimax(newBoard, player) {
            // array of all the available spots
            const availSpotsCheck = function (checkBoard) {
                let spots = [];
                for (let i = 0; i < checkBoard.length; i++) {
                    if (
                        checkBoard[i] !== setup.human.sign &&
                        checkBoard[i] !== setup.ai.sign
                    ) {
                        spots.push(i);
                    }
                }
                return spots;
            };
            // console.log ("available spots are");
            const availSpots = availSpotsCheck(newBoard);
            // human is minimizing player / endstate
            if (game.checkWin(newBoard, setup.human)) {
                return { score: -10 };
                // ai is maximizing player / endstate
            } else if (game.checkWin(newBoard, setup.ai)) {
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
                move.index = availSpots[i];
                // make the move
                newBoard[availSpots[i]] = player.sign;
                // check for endstate after making the move, if not found it will run callback
                if (player == setup.ai) {
                    let result = minimax(newBoard, setup.human);
                    move.score = result.score;
                } else {
                    let result = minimax(newBoard, setup.ai);
                    move.score = result.score;
                }
                // unmake the move if no endstate found
                newBoard[availSpots[i]] = "";
                // add this move to the array of possible moves
                moves.push(move);
            }

            let bestMove;
            if (player == setup.ai) {
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

    return {
        aiPlay,
        aiThinking,
    };
})();
