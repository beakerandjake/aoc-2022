/**
 * Contains solutions for Day 25
 * Puzzle Description: https://adventofcode.com/2022/day/25
 */
import { sum } from './util/array.js';

const snafuValueMap = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
};

const snafuToDecimal = (snafu) =>
  [...snafu]
    .reverse()
    .reduce((total, char, index) => total + 5 ** index * snafuValueMap[char], 0);

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  // your code here
  const decimals = lines.map(snafuToDecimal);
  return sum(decimals);
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
