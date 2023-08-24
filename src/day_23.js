/**
 * Contains solutions for Day 23
 * Puzzle Description: https://adventofcode.com/2022/day/23
 */
import {
  Vector2,
  equals,
  up,
  down,
  left,
  right,
  upLeft,
  upRight,
  downLeft,
  downRight,
  add,
  zero,
} from './util/vector2.js';
import { worldToString } from './util/debug.js';

// faster parsing methods, could come in handy later, but ugly..
// const parseLine = (line, y) =>
//   [...line].reduce((acc, char, x) => {
//     if (char === '#') {
//       acc.push(new Vector2(x, y));
//     }
//     return acc;
//   }, []);
// const parseLines = (lines) =>
//   lines
//     .map((line, y) => parseLine(line, y))
//     .reduce((acc, points) => {
//       acc.push(...points);
//       return acc;
//     }, []);

const compass = {
  N: up,
  E: right,
  S: down,
  W: left,
  NE: upRight,
  NW: upLeft,
  SE: downRight,
  SW: downLeft,
};

// const neighbors = {
//   north: [compass.N, compass.NE, compass.NW],
//   south: [compass.S, compass.SE, compass.SW],
//   west: [compass.W, compass.NW, compass.SW],
//   east: [compass.E, compass.NE, compass.SE],
//   any: Object.values(compass),
// };

const defaultRules = [
  // all directions.
  [[up, down, left, right, upRight, upLeft, downRight, downLeft], zero, 'all'],
  // north
  [[up, upLeft, upRight], up, 'north'],
  // south
  [[down, downLeft, downRight], down, 'south'],
  // west
  [[left, upLeft, downLeft], left, 'west'],
  // east
  [[right, upRight, downRight], right, 'east'],
];

// todo look into bit packing into 32 bits with 16 bits for x and y
// might be a faster hash than tostring.. wrap with method for now.
const hash = (vector) => vector.toString();

const parseLine = (line, y) =>
  [...line]
    .map((char, x) => (char === '#' ? x : null))
    .filter((x) => x !== null)
    .map((x) => new Vector2(x, y));

const parseLines = (lines) => lines.map(parseLine).flat();

const includes = (elf, elves) => elves.find((x) => equals(x, elf));

const isOccupied = (position, elves) => includes(position, elves);

const anyOccupied = (positions, elves) =>
  positions.some((position) => isOccupied(position, elves));

const applyRules = (elf, elves, rules) => {
  const matchingRule = rules.find(([directions]) => {
    const neighbors = directions.map((direction) => add(elf, direction));
    return !anyOccupied(neighbors, elves);
  });
  console.log(`matching rule: ${matchingRule ? matchingRule[2] : 'none'}`);
  return matchingRule ? add(elf, matchingRule[1]) : elf;
};

const getNeighbors = (elf, directions) =>
  directions.map((direction) => add(elf, direction));

// const checkNeighbors = (elf, elves, direction) =>
//   anyOccupied(getNeighbors(elf, neighbors[direction]), elves);

// const getDesiredMove = (elf, elves, movePriorities) => {
//   // no neighbors? stay put.
//   if (!checkNeighbors(elf, elves, neighbors.any)) {
//     return elf;
//   }

//   return movePriorities.find((direction) => !checkNeighbors(elf, elves, direction));
// };

const cycleRules = (directions) => [
  directions[0],
  directions[2],
  directions[3],
  directions[4],
  directions[1],
];

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input, lines }) => {
  // your code here
  const initialState = parseLines(lines);
  // const world = worldToString(initialState);

  const center = new Vector2(1, 1);
  const result = applyRules(center, initialState, defaultRules);

  // console.log(test);
  return 1234;
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
