/**
 * Contains solutions for Day 4
 * Puzzle Description: https://adventofcode.com/2022/day/4
 */

// parses each number of the input.
const parseRegex = /(\d+)-(\d+),(\d+)-(\d+)/;

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) =>
  lines.reduce((acc, line) => {
    const matches = line.match(parseRegex);
    const lhs = [+matches[1], +matches[2]];
    const rhs = [+matches[3], +matches[4]];
    return (lhs[0] >= rhs[0] && lhs[1] <= rhs[1]) ||
      (rhs[0] >= lhs[0] && rhs[1] <= lhs[1])
      ? acc + 1
      : acc;
  }, 0);

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ lines }) =>
  lines.reduce((acc, line) => {
    const matches = line.match(parseRegex);
    const lhs = [+matches[1], +matches[2]];
    const rhs = [+matches[3], +matches[4]];
    return (lhs[1] >= rhs[0] && lhs[1] <= rhs[1]) ||
      (rhs[1] >= lhs[0] && rhs[1] <= lhs[1])
      ? acc + 1
      : acc;
  }, 0);
