/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2022/day/1
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  let calories = 0;
  let highest = 0;

  lines.forEach((line) => {
    if (line === '') {
      if (calories > highest) {
        highest = calories;
      }
      calories = 0;
      return;
    }

    calories += parseInt(line, 10);
  });

  return highest;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input }) => {
  const [first, second, third] = input
    .split('\n\n')
    .map((elf) =>
      elf.split('\n').reduce((acc, calorie) => acc + parseInt(calorie, 10), 0)
    )
    .sort((a, b) => a - b)
    .reverse();

  return first + second + third;
};
