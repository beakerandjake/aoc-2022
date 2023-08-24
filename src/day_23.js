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
  findBounds,
  area,
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
const toLookup = (points) => new Set(points.map(hash));
const isOccupied = (point, pointLookup) => pointLookup.has(hash(point));

const parseLine = (line, y) =>
  [...line]
    .map((char, x) => (char === '#' ? x : null))
    .filter((x) => x !== null)
    .map((x) => new Vector2(x, y));

const parseLines = (lines) => lines.map(parseLine).flat();

const hasNeighbors = (elf, directions, elfLookup) =>
  directions
    .map((direction) => add(elf, direction))
    .some((position) => isOccupied(position, elfLookup));

const roundFirstHalf = (elf, elfLookup, rules) => {
  const matchingRule = rules.find(
    ([directions]) => !hasNeighbors(elf, directions, elfLookup)
  );
  return matchingRule ? add(elf, matchingRule[1]) : elf;
};

const roundSecondHalf = (elves, desired) =>
  desired.map((position, index) => {
    if (equals(position, elves[index])) {
      return position;
    }
    return desired.filter((x) => equals(x, position)).length === 1
      ? position
      : elves[index];
  });

const simulateRound = (elves, rules) => {
  const elfLookup = toLookup(elves);
  const desired = elves.map((elf) => roundFirstHalf(elf, elfLookup, rules));
  return roundSecondHalf(elves, desired);
};

const cycleRules = (rules) => [rules[0], rules[2], rules[3], rules[4], rules[1]];

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  const countEmptySpaces = (elves) => area(findBounds(elves)) - elves.length;

  const simulateRounds = (elves, rules, number) => {
    let currentElves = elves;
    let currentRules = rules;
    let currentRound = number;
    while (currentRound--) {
      currentElves = simulateRound(currentElves, currentRules);
      currentRules = cycleRules(currentRules);
    }
    return currentElves;
  };

  return ({ lines }) => {
    const elves = parseLines(lines);
    const result = simulateRounds(elves, defaultRules, 10);
    return countEmptySpaces(result);
  };
})();

const arraysEqual = (lhs, rhs) => lhs.every((x, index) => equals(x, rhs[index]));

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ lines }) => {
  let elves = parseLines(lines);
  let rules = [...defaultRules];
  let roundNumber = 1;

  for (;;) {
    const result = simulateRound(elves, rules);

    if (arraysEqual(elves, result)) {
      break;
    }

    elves = result;
    rules = cycleRules(rules);
    roundNumber++;
  }

  return roundNumber;
};
