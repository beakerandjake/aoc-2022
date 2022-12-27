/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2022/day/1
 */

/**
 * Returns the solution for part one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const partOne = ({ input }) => {
  const elves = input
    .split('\n\n')
    .map((elf) => elf.split('\n').reduce((acc, calorie) => acc + parseInt(calorie, 10), 0))
    .sort((a, b) => a - b)
    .reverse();

  return elves[0];
};

/**
 * Returns the solution for part two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const partTwo = ({ input }) => {
  const [first, second, third] = input
    .split('\n\n')
    .map((elf) => elf.split('\n').reduce((acc, calorie) => acc + parseInt(calorie, 10), 0))
    .sort((a, b) => a - b)
    .reverse();

  return first + second + third;
};
