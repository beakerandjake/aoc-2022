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

const roundSecondHalf = (elfCurrent, elfDesired, duplicateMoveLookup) => {
  if (equals(elfCurrent, elfDesired)) {
    return elfCurrent;
  }
  return duplicateMoveLookup.has(hash(elfDesired)) ? elfCurrent : elfDesired;
};

const filterDuplicates = (items, hashFn) => {
  const counts = items.reduce((acc, item, index) => {
    const hashed = hashFn(item);
    acc[hashed] = acc[hashed] ? acc[hashed] + 1 : 1;
    return acc;
  }, {});
  return items.filter((item) => counts[hash(item)] > 1);
};

const simulateRound = (elves, rules) => {
  const elfLookup = toLookup(elves);
  const desired = elves.map((elf) => roundFirstHalf(elf, elfLookup, rules));
  const duplicateMoveLookup = toLookup(filterDuplicates(desired, hash));
  return elves.map((elf, index) =>
    roundSecondHalf(elf, desired[index], duplicateMoveLookup)
  );
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
