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

// maps each shape to the information needed to play rock paper scissors.
const rules = {
  [shapes.rock]: {
    shapeScore: 1,
    beats: shapes.scissors,
    losesTo: shapes.paper,
  },
  [shapes.paper]: {
    shapeScore: 2,
    beats: shapes.rock,
    losesTo: shapes.scissors,
  },
  [shapes.scissors]: {
    shapeScore: 3,
    beats: shapes.paper,
    losesTo: shapes.rock,
  },
};

/**
 * Returns the outcome of the round.
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
  return rules[myThrow].beats === theirThrow ? 6 : 0;
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  // maps the key in the input to the shape that I should throw.
  const myThrowsInputMap = [
    { key: 'X', shape: shapes.rock },
    { key: 'Y', shape: shapes.paper },
    { key: 'Z', shape: shapes.scissors },
  ];

  // maps every possible combination of hands to their resulting score.
  const scoreLookup = Object.values(shapes).reduce((acc, elfThrow) => {
    myThrowsInputMap.forEach((myThrow) => {
      const roundOutcome = getRoundOutcome(elfThrow, myThrow.shape);
      acc[`${elfThrow} ${myThrow.key}`] = roundOutcome + rules[myThrow.shape].shapeScore;
    });
    return acc;
  }, {});

  // total the scores of each round in the input.
  return ({ lines }) => lines.reduce((total, line) => total + scoreLookup[line], 0);
})();

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = (() => {
  // const myOutcomesLookup = [
  //   // Lose
  //   { key: 'X', getMyShape: (theirShape) => test[theirShape].beats },
  //   // Draw
  //   { key: 'Y', getMyShape: (theirShape) => theirShape },
  //   // Win
  //   { key: 'Z', getMyShape: (theirShape) => test[theirShape].losesTo },
  // ];
  // const scoreLookup = Object.values(shapeKeys).reduce((acc, elfThrow) => {
  //   myOutcomesLookup.forEach((myOutcome) => {
  //     const myShape = myOutcome.getMyShape(elfThrow);
  //     const roundOutcome = getRoundOutcome(elfThrow, myOutcome.getMyShape(elfThrow));
  //     acc[`${elfThrow} ${myThrow.key}`] = roundOutcome + myThrow.shapeScore;
  //   });
  //   return acc;
  // }, {});
})();

// export const levelOne = solveLevelOne();
