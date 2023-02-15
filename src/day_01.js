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
  const { length } = lines;

  for (let index = 0; index < length; index++) {
    const line = lines[index];

    if (!line) {
      if (calories > highest) {
        highest = calories;
      }
      calories = 0;
    } else {
      calories += +line;
    }
  }

  // since the input does not end in a new line, the last group is not compared to highest
  // do this comparison here in case the last group happens to have the highest.
  return highest > calories ? highest : calories;
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

  for (let index = lines.length; index--; ) {
    const line = lines[index];
    if (!line) {
      if (calories > first) {
        third = second;
        second = first;
        first = calories;
      } else if (calories > second) {
        third = second;
        second = calories;
      } else if (calories > third) {
        third = calories;
      }
      calories = 0;
    } else {
      calories += +line;
    }
  }

  return first + second + third;
};
