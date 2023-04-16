import { toNumber } from './util/string.js';
import { Vector2 } from './util/vector2.js';
/**
 * Contains solutions for Day 14
 * Puzzle Description: https://adventofcode.com/2022/day/14
 */

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

const expandPath = (start, end) => {
  const inBetween =
    start.x === end.x
      ? numbersInBetween(start.y, end.y).map((y) => new Vector2(start.x, y))
      : numbersInBetween(start.x, end.x).map((x) => new Vector2(x, start.y));
  return [start, ...inBetween, end];
};

const coordinateRegex = /(\d+),(\d+)/g;

const parseLine = (line) =>
  [...line.matchAll(coordinateRegex)].map(
    (match) => new Vector2(toNumber(match[1]), toNumber(match[2]))
  );

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input, lines }) => {
  const rocks = new Set();

  const z = lines.map(parseLine)[0];
  console.log(z);
  const result = expandPath(z[0], z[1]);
  console.log(result);
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
