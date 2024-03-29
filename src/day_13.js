import { toNumber, product } from './util/index.js';

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
// const parsePacket = (line) => consumeArray(line, 0).parsed;
const parsePacket = (line) => JSON.parse(line);

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
  const leftMaxIndex = left.length - 1;
  const rightMaxIndex = right.length - 1;
  const maxIndex = Math.max(leftMaxIndex, rightMaxIndex);

  for (let index = 0; index <= maxIndex; index++) {
    // If the left list runs out of items first, the inputs are in the right order.
    if (index > leftMaxIndex && index <= rightMaxIndex) {
      return true;
    }

    // If the right list runs out of items first, the inputs are not in the right order.
    if (index <= leftMaxIndex && index > rightMaxIndex) {
      return false;
    }

    const result = compareFn(left[index], right[index]);

    if (result !== undefined) {
      return result;
    }
  }

  // If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
  return undefined;
};

/**
 * Compares two values in a packet.
 * Returns true if the values mean the packet is in the right order
 * Returns false if the values mean the packet is in the wrong order
 * Returns undefined if the values are indeterminate.``
 */
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
const packetsInCorrectOrder = (left, right) => compareArrays(left, right, compareValues);

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const results = lines.reduce((acc, _, index) => {
    if ((index + 1) % 3 === 0) {
      const left = parsePacket(lines[index - 2]);
      const right = parsePacket(lines[index - 1]);
      acc.push(packetsInCorrectOrder(left, right));
    }
    return acc;
  }, []);

  return results.reduce((sum, correct, index) => (correct ? sum + index + 1 : sum), 0);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const dividerStartPacket = [[2]];
  const dividerEndPacket = [[6]];

  /**
   * Returns a new array containing the packets with the divider packets added.
   */
  const addDividerPackets = (packets) => [
    ...packets,
    dividerStartPacket,
    dividerEndPacket,
  ];

  /**
   * Sort function which defines the order of two packets.
   */
  const sortPackets = (a, b) => {
    const sortResult = packetsInCorrectOrder(a, b);

    if (sortResult === undefined) {
      return 0;
    }

    return sortResult ? -1 : 1;
  };

  /**
   * Returns an array containing the 1 based indices of the divider packets.
   */
  const findIndicesOfDividerPackets = (packets) => {
    const toReturn = [];
    let index = 0;

    while (index < packets.length || toReturn.length !== 2) {
      const packet = packets[index];
      if (packet === dividerStartPacket) {
        toReturn.push(index + 1);
      } else if (packet === dividerEndPacket) {
        toReturn.push(index + 1);
      }
      index++;
    }

    return toReturn;
  };

  return ({ lines }) => {
    const packets = addDividerPackets(lines.filter((x) => x.length).map(parsePacket));
    packets.sort(sortPackets);
    return product(findIndicesOfDividerPackets(packets));
  };
})();
