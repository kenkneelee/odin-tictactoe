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

const game = (() => {
    // keep track of whose turn it is
    let turn = true;
    const headertest = document.querySelector("h1");
    const switchTurn = function () {
        if (this.turn == true) {
            this.turn = false;
            headertest.textContent = "Player 2's turn";
        } else {
            this.turn = true;
            headertest.textContent = "Player 1's turn";
        }
    };

    // check for a game winner
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

        let checker = (playerTotal, winner) =>
            winner.every((value) => playerTotal.includes(value));

        // for every winning combo, check if the player's total matches it
        for (let i = 0; i < winningCombos.length; i++) {
            const winner = winningCombos[i];
            const humanScore = human.total.map(Number);
            const aiScore = ai.total.map(Number);
            const modal = document.getElementById("outcomeModal");
            let gameWinner = document.getElementById("winner");

            if (checker(humanScore, winner)) {
                console.log("Human wins!");
                human.sayHello();
                gameWinner.textContent = "Human";
                modal.style.display = "block";
            }
            if (checker(aiScore, winner)) {
                console.log("AI wins!");
                gameWinner.textContent = "AI";
                ai.sayHello();
                modal.style.display = "block";
            }
        }
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

    const newBoard = function () {
        cells.forEach((cell) => {
            cell.textContent = "";
        });
        human.total = [];
        ai.total = [];
        game.turn = true;
    };

    const replay = document.querySelector(".replay");
    const modal = document.getElementById("outcomeModal");

    replay.addEventListener("click", () => {
        newBoard();
        modal.style.display = "none";
    });

    return {};
})();

//player FACTORY
const playerFactory = function (name, sign) {
    const sayHello = function () {
        console.log("Hello! I am " + name + ". I win!");
    };
    this.total = [];
    return { name, sign, total, sayHello };
};

const human = playerFactory("Human", "X");
const ai = playerFactory("AI", "O");

// game object

// gameBoard = module

// displayController = module

// mePlayer = factory
