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
export const levelOne = (() => {
  const includes = (lhs, rhs) => lhs[0] >= rhs[0] && lhs[1] <= rhs[1];

  return ({ lines }) =>
    lines.reduce((acc, line) => {
      const matches = line.match(parseRegex);
      const lhs = [Number.parseInt(matches[1], 10), Number.parseInt(matches[2], 10)];
      const rhs = [Number.parseInt(matches[3], 10), Number.parseInt(matches[4], 10)];
      return includes(lhs, rhs) || includes(rhs, lhs) ? acc + 1 : acc;
    }, 0);
})();

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ lines }) => {
  const overlaps = (lhs, rhs) => lhs[1] >= rhs[0] && lhs[1] <= rhs[1];

  return lines.reduce((acc, line) => {
    const matches = line.match(parseRegex);
    const lhs = [Number.parseInt(matches[1], 10), Number.parseInt(matches[2], 10)];
    const rhs = [Number.parseInt(matches[3], 10), Number.parseInt(matches[4], 10)];
    return overlaps(lhs, rhs) || overlaps(rhs, lhs) ? acc + 1 : acc;
  }, 0);
};
