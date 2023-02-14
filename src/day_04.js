/**
 * Contains solutions for Day 4
 * Puzzle Description: https://adventofcode.com/2022/day/4
 */

const parseRange = (value) => {
  const split = value.split('-');
  return [Number.parseInt(split[0], 10), Number.parseInt(split[1], 10)];
};

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
      const pairs = line.split(',');
      const lhs = parseRange(pairs[0]);
      const rhs = parseRange(pairs[1]);
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
    const pairs = line.split(',');
    const lhs = parseRange(pairs[0]);
    const rhs = parseRange(pairs[1]);
    return overlaps(lhs, rhs) || overlaps(rhs, lhs) ? acc + 1 : acc;
  }, 0);
};
