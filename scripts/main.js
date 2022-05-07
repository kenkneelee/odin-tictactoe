//player FACTORY===================================
const playerFactory = function (name, sign) {
    const sayHello = function () {
        console.log("Hello! I am " + name + ". I win!");
        return "Hello! I am " + name + ". I win!";
    };
    this.total = [];
    this.wins = 0;
    return { name, sign, total, wins, sayHello };
};

// Initialize player objects
const human = playerFactory("Human", "X");
const ai = playerFactory("AI", "O");

// game MODULE======================================
const game = (() => {
    // store whether game is over
    let gameOver = false;
    // keep track of whose turn it is
    let turn = true;
    const header = document.querySelector("h1");
    const turnText = document.createElement("p");
    turnText.textContent = "turn";
    const thinkingText = document.createElement("p");
    thinkingText.textContent = "thinking";
    const winCounters = document.getElementsByClassName("winCounter");

    const switchTurn = function () {
        if (this.turn == true) {
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
    const checkWin = function () {
        const winningCombos = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7],
        ];
        const modal = document.getElementById("outcomeModal");
        const modalContent = document.querySelector(".modal-content");
        const gameWinner = document.getElementById("winner");
        const winMsg = document.getElementById("winnerMsg");
        const replay = document.querySelector(".replay");

        // checker function to check a player total against a specific winning combo
        const checker = (playerTotal, winner) =>
            winner.every((value) => playerTotal.includes(value));

        // use checker function to compare player totals to all winning combos
        const humanScore = human.total.map(Number);
        const aiScore = ai.total.map(Number);
        for (let i = 0; i < winningCombos.length; i++) {
            const winner = winningCombos[i];
            // if  human has a winning score
            const checkForWinner = () => {
                if (checker(humanScore, winner)) {
                    console.log("Human wins!");
                    gameWinner.textContent = "Human";
                    winMsg.textContent = '"' + human.sayHello() + '"';
                    modalContent.classList.add("modal-content-active");
                    modal.style.display = "block";
                    game.gameOver = true;
                    human.wins ++;
                    winCounters[0].textContent = human.wins;
                    // if ai has a winning score
                } else if (checker(aiScore, winner)) {
                    console.log("AI wins!");
                    gameWinner.textContent = "AI";
                    winMsg.textContent = '"' + ai.sayHello() + '"';
                    modalContent.classList.add("modal-content-active");
                    modal.style.display = "block";
                    game.gameOver = true;
                    ai.wins ++;
                    winCounters[1].textContent = ai.wins;
                }
            };
            checkForWinner();

            // if there is a winner stop checking the other numbers and spamming the console
            if (game.gameOver == true) {
                break;
            }
        }
        // if neither player has winning score
        // and every cell is full
        if (gameBoard.allCellsFull() && game.gameOver == false) {
            console.log("Tie!");
            gameWinner.textContent = "Nobody";
            modalContent.classList.add("modal-content-active");
            winMsg.textContent = "";
            modal.style.display = "block";
            game.gameOver = true;
        }

        // reset game
        replay.addEventListener("click", () => {
            gameBoard.newBoard();
            human.total = [];
            ai.total = [];
            game.turn = true;
            header.textContent = "Here we go again..";
            modal.style.display = "none";
            game.gameOver = false;
        });
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

    const newBoard = function () {
        cells.forEach((cell) => {
            cell.textContent = "";
        });
    };

    // function to check whether the current cell is full
    const fullCell = (currentCell) => currentCell.textContent != "";
    // function to check whether all cells are empty
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
                cell.textContent = human.sign;
                human.total.push(cell.id);
                game.checkWin();
                if (game.gameOver == false) {
                    game.switchTurn();
                    easyAI.aiPlay();
                }
            } else if (
                game.turn == false &&
                cell.textContent == "" &&
                easyAI.aiThinking == false
            ) {
                console.log("AI plays on cell " + cell.id);
                cell.textContent = ai.sign;
                ai.total.push(cell.id);
                game.checkWin();
                if (game.gameOver == false) {
                    game.switchTurn();
                }
            }
        });
    });

    return {
        newBoard,
        allCellsFull,
        cellArray,
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

// FACTORY FUNCTION TO CREATE MULTIPLE.

//Factory functions are plain functions that RETURN OBJECTS to use in code.

// const playerFactory = function(name, sign) {
//     const sayHello = function () {
//         console.log("hello!");
//     }

//     return {name, sign, sayHello};
// };

// const jeff = playerFactory ("jeff", "x");
// console.log(jeff.name);
// jeff.sayHello();

// MODULE FUNCTION WHEN ONLY ONE

// THIS IS A FACTORY
// const calculator = (a, b) => {
//     const add = () => console.log(a + b);
//     return {
//         add
//     };
// };
// const calc1 = calculator(3, 5);
// calc1.add();

// THIS IS A MODULE (wrapped in IIFE and immediately called)
// const calculator = (() => {
//     const add = (a, b) => a + b;
//     return {
//       add
//     };
//   })();

//   calculator.add(3,5); // 8

// game = object IIFE

// gameBoard = module

// displayController = module

// mePlayer = factory
