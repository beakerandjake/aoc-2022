import { toNumber } from './util/string.js';
import { Vector2 } from './util/vector2.js';

/**
 * Contains solutions for Day 14
 * Puzzle Description: https://adventofcode.com/2022/day/14
 */

/**
 * Parses a single line of input and returns the scan trace.
 */
const parseLine = (() => {
  const coordinateRegex = /(\d+),(\d+)/g;
  return (line) =>
    [...line.matchAll(coordinateRegex)].map(
      (match) => new Vector2(toNumber(match[1]), toNumber(match[2]))
    );
})();

/**
 * Returns an array of all numbers between the start and end (excluding start and end).
 */
const numbersInBetween = (a, b) => {
  const max = Math.max(a, b);
  const min = Math.min(a, b);
  const toReturn = [];
  let current = min;
  while (++current < max) {
    toReturn.push(current);
  }
  return toReturn;
};

/**
 * Returns an array containing all rocks between the start and the end (excluding start and end).
 */
const expandPath = (start, end) =>
  start.x === end.x
    ? numbersInBetween(start.y, end.y).map((y) => new Vector2(start.x, y))
    : numbersInBetween(start.x, end.x).map((x) => new Vector2(x, start.y));

/**
 * Returns an array containing all rocks in the given path.
 */
const getAllRocksInPath = (() => {
  const trace = (path, idx) =>
    idx === 0
      ? [path[idx]]
      : [path[idx], ...expandPath(path[idx], path[idx - 1]), ...trace(path, idx - 1)];

  return (path) => trace(path, path.length - 1);
})();

const print = (rocks) =>
  (() => {
    const q = 10;
  })();

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const rocks = new Set(
    lines.reduce((acc, line) => [...acc, ...getAllRocksInPath(parseLine(line))], [])
  );
  console.log(rocks);

  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
