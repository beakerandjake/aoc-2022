/**
 * Contains solutions for Day 20
 * Puzzle Description: https://adventofcode.com/2022/day/20
 */
import { toNumber } from './util/string.js';

const parseInput = (lines) => lines.map(toNumber);

const decrypt = (encrypted, mixed) => mixed.map((x) => encrypted[x]);

const wrapIndex = (index, length) => (index + length) % length;

const move = (array, index, times, direction) => {
  const toReturn = [...array];
  let remaining = times;
  let a = index;
  let b = wrapIndex(index + direction, toReturn.length);
  while (remaining--) {
    const temp = toReturn[a];
    toReturn[a] = toReturn[b];
    toReturn[b] = temp;
    a = b;
    b = wrapIndex(b + direction, toReturn.length);
  }
  return toReturn;
};

const moveRight = (array, index, times) => move(array, index, times, 1);

const moveLeft = (array, index, times) => move(array, index, times, -1);

const coordinate = (encrypted, mixed) => {
  const zeroIndex = mixed.indexOf(encrypted.indexOf(0));
  const a = encrypted[mixed[(zeroIndex + 1000) % mixed.length]];
  const b = encrypted[mixed[(zeroIndex + 2000) % mixed.length]];
  const c = encrypted[mixed[(zeroIndex + 3000) % mixed.length]];
  return a + b + c;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const encrypted = parseInput(lines);
  let mixed = encrypted.map((_, index) => index);

  for (let index = 0; index < encrypted.length; index++) {
    const number = encrypted[index];
    const mixedIndex = mixed.indexOf(index);
    const numberOfMoves = Math.abs(number) % (mixed.length - 1);

    if (number === 0 || numberOfMoves === 0) {
      continue;
    }

    mixed =
      number > 0
        ? moveRight(mixed, mixedIndex, numberOfMoves)
        : moveLeft(mixed, mixedIndex, numberOfMoves);
  }

  return coordinate(encrypted, mixed);
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
