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
 * Parse a single line of the input which represents a packet.
 */
const parsePacket = (line) => consumeArray(line, 0).parsed;

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  for (let index = 0; index < lines.length; index += 3) {
    const first = parsePacket(lines[index]);
    const second = parsePacket(lines[index + 1]);
  }

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
