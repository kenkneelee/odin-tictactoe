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
    let turn = true;
    return {
        turn,
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
    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (game.turn == true && cell.textContent=="") {
            cell.textContent = "X";
            game.turn = false;
            }
            else if (game.turn == false && cell.textContent=="") {
            cell.textContent = "O";
            game.turn = true;
            }
        });
         
    });
    return {
        startBoard,
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
