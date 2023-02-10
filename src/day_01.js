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

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line === '') {
      if (calories > highest) {
        highest = calories;
      }
      calories = 0;
    } else {
      calories += parseInt(line, 10);
    }
  }

  return highest;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ lines }) => {
  let first = 0;
  let second = 0;
  let third = 0;
  let calories = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === '') {
      if (calories > first) {
        first = calories;
      } else if (calories > second) {
        second = calories;
      } else if (calories > third) {
        third = calories;
      }
      calories = 0;
    } else {
      calories += parseInt(line, 10);
    }
  }

  return first + second + third;
};
