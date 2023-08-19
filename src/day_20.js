/**
 * Contains solutions for Day 20
 * Puzzle Description: https://adventofcode.com/2022/day/20
 */
import { toNumber } from './util/string.js';
import { arrayToString } from './util/array.js';

// rollover from start, swap forward
// rollover from end, swap backward
// backward with no rollover, swap backward
// forward with no rollover, swap forward

// use secondary array, index in lines up to original array index, value is current index

// fn to calculate new index with rollover

// find index of zero

const parseInput = (lines) => lines.map(toNumber);

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  const encrypted = parseInput(lines);
  console.log(arrayToString(encrypted));
  return 10;
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
