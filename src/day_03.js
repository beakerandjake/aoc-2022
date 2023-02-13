/**
 * Contains solutions for Day 3
 * Puzzle Description: https://adventofcode.com/2022/day/3
 */

const lowercase = [...Array(26).keys()].map((x) => String.fromCharCode(x + 97));
const uppercase = [...Array(26).keys()].map((x) => String.fromCharCode(x + 65));
const priority = [...lowercase, ...uppercase].reduce((acc, x, index) => {
  acc[x] = index + 1;
  return acc;
}, {});

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => lines.reduce((acc, line) => {
    const half = line.length / 2;
    const lhsSet = new Set(line.slice(0, half));
    for (let index = half; index < line.length; index += 1) {
      if (lhsSet.has(line[index])) {
        return acc + priority[line[index]];
      }
    }
    return acc;
  }, 0);

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
