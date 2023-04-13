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

const compareIntegers = (left, right) => {
  // If the left integer is lower than the right integer, the inputs are in the right order.
  if (left < right) {
    return true;
  }

  // If the left integer is higher than the right integer, the inputs are not in the right order.
  if (left > right) {
    return false;
  }

  // Otherwise, the inputs are the same integer; continue checking the next part of the input.
  return undefined;
};

const compareArrays = (left, right, compareFn) => {
  /**
   * If both values are lists, compare the first value of each list, then the second value, and so on.
   * If the left list runs out of items first, the inputs are in the right order.
   * If the right list runs out of items first, the inputs are not in the right order.
   * If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
   */
  let index = 0;
  const lhsMaxIndex = Math.max(0, left.length - 1);
  const rhsMaxIndex = Math.max(0, right.length - 1);

  while (true) {
    if (index > lhsMaxIndex && index <= rhsMaxIndex) {
      return true;
    }

    if (index > rhsMaxIndex && index <= lhsMaxIndex) {
      return false;
    }

    const result = compareFn(left, right);

    if (result === false) {
      return result;
    }

    if (index === rhsMaxIndex && index === rhsMaxIndex) {
      return undefined;
    }

    index++;
  }
};

const compareValues = (left, right) => {
  const isArrayLeft = Array.isArray(left);
  const isArrayRight = Array.isArray(right);
  
  if (isArrayLeft && isArrayRight) {
    return compareArrays(left, right, compareValues);
  }

  if (isArrayLeft && !isArrayRight) {
    return compareArrays(left, [right], compareValues);
  }

  if (!isArrayLeft && isArrayRight) {
    return compareArrays([left], right, compareValues);
  }

  return compareIntegers(left, right);
};

/**
 * Compare the packets and returns true if they are in the right order.
 */
const packetsInCorrectOrder = (left, right) => {
  const result = compareArrays(left, right, compareValues);
  if (result === undefined) {
    throw new Error('Could not determine packet order');
  }
  return result;
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  let numberInCorrectOrder = 0;

  for (let index = 0; index < lines.length; index += 3) {
    const first = parsePacket(lines[index]);
    const second = parsePacket(lines[index + 1]);
    if (packetsInCorrectOrder(first, second)) {
      numberInCorrectOrder++;
    }
  }

  return numberInCorrectOrder;
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
