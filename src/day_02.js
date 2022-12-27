/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2022/day/2
 */

const elfThrows = [
  { key: 'A', value: 0 },
  { key: 'B', value: 1 },
  { key: 'C', value: 2 },
];

const myThrowsPartOne = [
  { key: 'X', value: 0, score: 1 },
  { key: 'Y', value: 1, score: 2 },
  { key: 'Z', value: 2, score: 3 },
];

/**
 * Create a lookup table that maps the input (elf hand and my hand) to the score.
 */
const partOneScoreTable = elfThrows.reduce((acc, elfThrow) => {
  myThrowsPartOne.forEach((myThrow) => {
    const roundOutcome = elfThrow.value - myThrow.value;
    let score = 0;

    if (roundOutcome === 0) {
      score = 3;
    }

    if (roundOutcome === -1 || roundOutcome === 2) {
      score = 6;
    }

    acc[`${elfThrow.key} ${myThrow.key}`] = score + myThrow.score;
  });

  return acc;
}, {});

/**
 * Returns the solution for part one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const partOne = ({ lines }) => (
  lines.reduce((total, line) => total + partOneScoreTable[line], 0)
);

/**
 * Returns the solution for part two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const partTwo = ({ input, lines }) => {
  // your code here
};
