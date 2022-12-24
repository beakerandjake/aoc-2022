// autogenerated solution file, for help see https://github.com/beakerandjake/advent-of-code-runner

const convertCodeToNumber = (code) => {
  switch (code) {
    // ROCK
    case 'A':
    case 'X':
      return 1;
    // PAPER
    case 'B':
    case 'Y':
      return 2;
    // SCISSOR
    case 'C':
    case 'Z':
      return 3;
    default:
      throw RangeError('Unknown code', code);
  }
};

/**
 * Returns the solution for part one of this puzzle.
 * @param {String} input - The input for this days puzzle.
 * @returns {Number|String}
 */
export const partOne = (input = '') => input
  .split('\n')
  .map((roundText) => {
    const converted = roundText.split(' ').map(convertCodeToNumber);
    const outcome = converted[0] - converted[1];
    let outcomeScore = 0;

    if (outcome === 0) {
      outcomeScore = 3;
    }
    if (outcome === -1 || outcome === 2) {
      outcomeScore = 6;
    }

    return converted[1] + outcomeScore;
  })
  .reduce((acc, x) => acc + x, 0);

/**
 * Returns the solution for part two of this puzzle.
 * @param {String} input - The input for this days puzzle.
 * @returns {Number|String}
 */
export const partTwo = (input = '') => {
  throw new Error('partTwo not implemented');
};
