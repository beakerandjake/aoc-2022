import { toNumber, inRange } from './util/index.js';

/**
 * Contains solutions for Day 13
 * Puzzle Description: https://adventofcode.com/2022/day/13
 */

const arrayToString = (array) =>
  `[${array.map((x) => (Array.isArray(x) ? arrayToString(x) : x)).join(',')}]`;

/**
 * Consumes all numeric characters from the given index and returns the parsed number.
 */
const consumeNumber = (str, index) => {
  let currentIndex = index;

  while (str[currentIndex] >= '0' && str[currentIndex] <= '9') {
    currentIndex += 1;
  }

  return { parsed: toNumber(str.slice(index, currentIndex)), index: currentIndex };
};

/**
 * Builds and returns an array by seeking each character in the string, recursively building elements.
 */
const consumeArray = (str, index) => {
  if (str[index] !== '[') {
    return null;
  }

  let currentIndex = index + 1;
  const toReturn = [];

  while (str[currentIndex] !== ']') {
    if (str[currentIndex] === ',') {
      currentIndex++;
      continue;
    }

    const parseResult =
      str[currentIndex] === '['
        ? consumeArray(str, currentIndex)
        : consumeNumber(str, currentIndex);

    toReturn.push(parseResult.parsed);
    currentIndex = parseResult.index;
  }

  return { parsed: toReturn, index: currentIndex + 1 };
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  // const result = consumeArray(lines[0], 0);
  // console.log(arrayToString(result.parsed));
  // console.log(arrayToString(JSON.parse(lines[0])));

  const result = consumeArray(lines[0], 0);
  // const result = arrayToString(JSON.parse(lines[0]));

  return 123;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
