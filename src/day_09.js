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

const parseLine = (() => {
  const directionMap = {
    D: down,
    R: right,
    L: left,
    U: up,
  };

  return (line = '') => {
    const [direction, steps] = line.split(' ');
    return directionMap[direction](+steps);
  };
})();

const distanceSquared = (lhs, rhs) => (lhs.y - rhs.y) ** 2 + (lhs.x - rhs.x) ** 2;

const directions = {
  up: new Vector2(0, 1),
  down: new Vector2(0, -1),
  left: new Vector2(-1, 0),
  right: new Vector2(1, 0),
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
    const movement = parseLine(line);
    head = add(head, movement);
    totalDistance += distanceSquared(head, tail);
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
