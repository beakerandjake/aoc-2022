/**
 * Contains solutions for Day 9
 * Puzzle Description: https://adventofcode.com/2022/day/9
 */

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `<${this.x},${this.y}>`;
  }
}

const add = (lhs, rhs) => new Vector2(lhs.x + rhs.x, lhs.y + rhs.y);

const up = (amount) => new Vector2(0, amount);
const down = (amount) => new Vector2(0, -amount);
const left = (amount) => new Vector2(-amount, 0);
const right = (amount) => new Vector2(amount, 0);

// const parseLine = (() => {
//   const directionMap = {
//     D: down,
//     R: right,
//     L: left,
//     U: up,
//   };

//   return (line = '') => {
//     const [direction, steps] = line.split(' ');
//     return directionMap[direction](+steps);
//   };
// })();

const distanceSquared = (lhs, rhs) => (lhs.y - rhs.y) ** 2 + (lhs.x - rhs.x) ** 2;

const areTouching = (head, tail) => distanceSquared(head, tail) <= 1;

const directions = {
  U: new Vector2(0, 1),
  D: new Vector2(0, -1),
  L: new Vector2(-1, 0),
  R: new Vector2(1, 0),
};

const parseLine = (line) => {
  const [direction, steps] = line.split(' ');
  return { direction: directions[direction], steps: +steps };
};

const movementPlan = (start, direction, steps) => {
  const positions = [];
  let current = start;
  while (positions.length < steps) {
    current = add(current, direction);
    positions.push(current);
  }
  return positions;
};



const moveRight = (position) => new Vector2(position.x + 1, position.y);
const moveLeft = (position) => new Vector2(position.x - 1, position.y);
const moveUp = (position) => new Vector2(position.x, position.y + 1);
const moveDown = (position) => new Vector2(position.x, position.y - 1);

const isLeft = (lhs, rhs) => lhs.x < rhs.x;
const isRight = (lhs, rhs) => lhs.x > rhs.x;
const isUp = (lhs, rhs) => lhs.y > rhs.y;
const isDown = (lhs, rhs) => lhs.y < rhs.y;

const sameRow = (lhs, rhs) => lhs.y === rhs.y;
const sameColumn = (lhs, rhs) => lhs.x === rhs.x;

// const catchUp = (head, tail) => {
//   if(sameColumn(head, tail)) {
//     return isLeft(head, tail)
//       ? moveLeft(tail)
//       : moveRight(tail);
//   } else if (sameRow(head, tail)) {
//     return isUp(head, tail)
//       ? moveUp(tail)
//       : moveDown(tail);
//   }

// };

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  // console.log();

  let head = new Vector2(0, 0);
  const tail = new Vector2(0, -5);

  let totalDistance = 0;

  lines.forEach((line) => {
    const { direction, steps } = parseLine(line);
    const plan = movementPlan(head, direction, steps);
    console.log(`step: ${line}, plan: [${plan}]`);
  });
  // your code here

  return totalDistance;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
