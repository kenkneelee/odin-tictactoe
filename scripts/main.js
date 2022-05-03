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
    // keep track of who's turn it is
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

    // after every move, check for a winner

    // const player1total = array of all of player 1's ticks
    // const player2total = array of all of player 2's ticks

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
        // for every winning combo,
        for (let i = 0; i < winningCombos.length; i++) {
            // for every cell in the winning combo
                const winner = winningCombos[i];
                console.log ("Checking winning numbers "  + winner)
                let checker = (playerTotal, winner) => winner.every(v => playerTotal.includes(v));
                console.log("Player score is " + gameBoard.playerTotal.map(Number));
                console.log(checker(gameBoard.playerTotal.map(Number), winner));
                // let array1 = [1,2,3],
                // array2 = [1,2,3,4],
                // array3 = [1,2];
                // let checker = (arr, target) => target.every(v => arr.includes(v));
                // console.log(checker(array2, array1));  // true
                // console.log(checker(array3, array1));  // false

            // const checkWin = function {
            //     if player1total.contains()
            // }
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
    const startBoard = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];
    const cells = document.querySelectorAll(".cell");
    let playerTotal = [];

    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (game.turn == true && cell.textContent == "") {
                cell.textContent = "X";
                console.log(cell.id);
                playerTotal.push(cell.id);
                console.log(playerTotal);
                game.checkWin()
                game.switchTurn();
            } else if (game.turn == false && cell.textContent == "") {
                cell.textContent = "O";
                console.log(cell.id);
                game.switchTurn();
            }
        });
    });
    return {
        startBoard,
        playerTotal
    };
})();

//player FACTORY
const playerFactory = function (name, sign) {
    const sayHello = function () {
        console.log("hello!");
    };
    return { name, sign, sayHello };
};

const jeff = playerFactory("jeff", "x");
console.log(jeff.name);
jeff.sayHello();

// game object

// gameBoard = module

// displayController = module

// mePlayer = factory
