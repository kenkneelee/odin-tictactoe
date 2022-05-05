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

const game = (() => {
    // keep track of whose turn it is
    let turn = true;
    const header = document.querySelector("h1");
    const switchTurn = function () {
        if (this.turn == true) {
            this.turn = false;
            header.textContent = "Player 2's turn";
        } else {
            this.turn = true;
            header.textContent = "Player 1's turn";
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
        const replay = document.querySelector(".replay");


        // checker function to check a player total against a specific winning combo
        const checker = (playerTotal, winner) =>
            winner.every((value) => playerTotal.includes(value));

        // use checker function to compare player totals to all winning combos
        for (let i = 0; i < winningCombos.length; i++) {
            const winner = winningCombos[i];
            const humanScore = human.total.map(Number);
            const aiScore = ai.total.map(Number);
            // if  human has a winning score
            if (checker(humanScore, winner)) {
                console.log("Human wins!");
                human.sayHello();
                gameWinner.textContent = "Human";
                modalContent.classList.add("modal-content-active");
                modal.style.display = "block";
            // if ai has a winning score
            } else if (checker(aiScore, winner)) {
                console.log("AI wins!");
                gameWinner.textContent = "AI";
                ai.sayHello();
                modalContent.classList.add("modal-content-active");
                modal.style.display = "block";
            // if neither player has winning score
            // and every cell is full
            } else if (
                !checker(humanScore, winner) &&
                !checker(aiScore, winner) &&
                gameBoard.allCellsFull()
                ) {
                console.log("Tie!");
                gameWinner.textContent = "Nobody";
                modalContent.classList.add("modal-content-active");
                modal.style.display = "block";
            }
        }

        // reset game
        replay.addEventListener("click", () => {
            gameBoard.newBoard();
            human.total = [];
            ai.total = [];
            game.turn = true;
            modal.style.display = "none";
        });
    };

    // return
    return {
        turn,
        switchTurn,
        checkWin,
    };
})();

//gameboard MODULE
const gameBoard = (() => {
    const cells = document.querySelectorAll(".cell");
    const cellArray = Array.from(cells);

    const newBoard = function () {
        cells.forEach((cell) => {
            cell.textContent = "";
        });
    };

    // function to check whether the current cell is empty
    const fullCell = (currentCell) => currentCell.textContent != "";
    // function to check whether all cells are empty
    const allCellsFull = () => {return cellArray.every(fullCell);}

    // add functionality to each cell
    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (game.turn == true && cell.textContent == "") {
                cell.textContent = human.sign;
                human.total.push(cell.id);
                game.checkWin();
                game.switchTurn();
            } else if (game.turn == false && cell.textContent == "") {
                cell.textContent = ai.sign;
                ai.total.push(cell.id);
                game.checkWin();
                game.switchTurn();
            }
        });
    });

    return {
        newBoard,
        allCellsFull,
    };
})();

//player FACTORY
const playerFactory = function (name, sign) {
    const sayHello = function () {
        console.log("Hello! I am " + name + ". I win!");
    };
    this.total = [];
    return { name, sign, total, sayHello };
};

// Create player objects
const human = playerFactory("Human", "X");
const ai = playerFactory("AI", "O");
