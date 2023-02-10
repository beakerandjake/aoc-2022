/**
 * Contains solutions for Day 2
 * Puzzle Description: https://adventofcode.com/2022/day/2
 */

// maps a shape to its key in the input file.
const shapes = {
  rock: 'A',
  paper: 'B',
  scissors: 'C',
};

// maps a shape to the shape it beats.
const shapeVictoryTable = {
  [shapes.rock]: shapes.scissors,
  [shapes.paper]: shapes.rock,
  [shapes.scissors]: shapes.paper,
};

/**
 * Returns the score for the outcome of the round.
 * - 0 points for a loss
 * - 3 points for a draw
 * - 6 points for a win
 * @param {'A'|'B'|'C'} theirThrow - The shape key of their throw
 * @param {'A'|'B'|'C'} myThrow - The shape key of my throw
 * @returns {Number}
 */
const getRoundOutcome = (theirThrow, myThrow) => {
  if (myThrow === theirThrow) {
    return 3;
  }
  return shapeVictoryTable[myThrow] === theirThrow ? 6 : 0;
};

// helps to parse the input file for level one.
const myThrowsLookupLevelOne = [
  { key: 'X', shape: shapes.rock, shapeScore: 1 },
  { key: 'Y', shape: shapes.paper, shapeScore: 2 },
  { key: 'Z', shape: shapes.scissors, shapeScore: 3 },
];

// a lookup table for level one which maps every possible combination of hands to their resulting score.
const levelOneScoreLookupTable = Object.values(shapes).reduce((acc, elfThrow) => {
  myThrowsLookupLevelOne.forEach((myThrow) => {
    const roundOutcome = getRoundOutcome(elfThrow, myThrow.shape);
    acc[`${elfThrow} ${myThrow.key}`] = roundOutcome + myThrow.shapeScore;
  });
  return acc;
}, {});

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) =>
  lines.reduce((total, line) => total + levelOneScoreLookupTable[line], 0);

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {};
