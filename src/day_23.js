/**
 * Contains solutions for Day 23
 * Puzzle Description: https://adventofcode.com/2022/day/23
 */
import {
  Vector2,
  equals as pointsAreEqual,
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
  toLookup,
  area,
} from './util/vector2.js';
import { filterDuplicates, arraysEqual } from './util/array.js';

/**
 * Each entry is an array containing
 * The adjacent positions for the elf to look for other elves in.
 * The proposed direction of movement if no elves are present in the adjacent positions.
 */
const defaultRules = [
  // all directions.
  [[up, down, left, right, upRight, upLeft, downRight, downLeft], zero],
  // north
  [[up, upLeft, upRight], up],
  // south
  [[down, downLeft, downRight], down],
  // west
  [[left, upLeft, downLeft], left],
  // east
  [[right, upRight, downRight], right],
];

const parseLine = (line, y) =>
  [...line]
    .map((char, x) => (char === '#' ? x : null))
    .filter((x) => x !== null)
    .map((x) => new Vector2(x, y));

const parseLines = (lines) => lines.map(parseLine).flat();

const fastHash = ({ x, y }) => x + (y << 16);

const includes = (pointLookup, point) => pointLookup.has(fastHash(point));

const hasNeighbors = (elf, directions, elfLookup) => {
  for (let i = directions.length; i--; ) {
    if (includes(elfLookup, add(elf, directions[i]))) {
      return true;
    }
  }
  return false;
};

const roundFirstHalf = (elf, elfLookup, rules) => {
  const matchingRule = rules.find(
    ([directions]) => !hasNeighbors(elf, directions, elfLookup)
  );
  return matchingRule ? add(elf, matchingRule[1]) : elf;
};

const roundSecondHalf = (elfCurrent, elfDesired, invalidMoveLookup) => {
  if (pointsAreEqual(elfCurrent, elfDesired)) {
    return elfCurrent;
  }
  return includes(invalidMoveLookup, elfDesired) ? elfCurrent : elfDesired;
};

const simulateRound = (elves, rules) => {
  const elfLookup = toLookup(elves, fastHash);
  const desired = elves.map((elf) => roundFirstHalf(elf, elfLookup, rules));
  const invalidMoveLookup = toLookup(filterDuplicates(desired, fastHash), fastHash);
  return elves.map((elf, index) =>
    roundSecondHalf(elf, desired[index], invalidMoveLookup)
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

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  let elves = parseLines(lines);
  let rules = defaultRules;
  let round = 1;

  for (;;) {
    const result = simulateRound(elves, rules);
    if (arraysEqual(elves, result, pointsAreEqual)) {
      return round;
    }
    elves = result;
    rules = cycleRules(rules);
    round++;
  }
};
