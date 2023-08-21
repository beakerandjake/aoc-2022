/**
 * Contains solutions for Day 20
 * Puzzle Description: https://adventofcode.com/2022/day/20
 */
import { toNumber } from './util/string.js';
import { arrayToString } from './util/array.js';

// rollover from start, swap forward
// rollover from end, swap backward
// backward with no rollover, swap backward
// forward with no rollover, swap forward

// use secondary array, index in lines up to original array index, value is current index

// fn to calculate new index with rollover

// find index of zero

const parseInput = (lines) => lines.map(toNumber);

const decrypt = (encrypted, mixed) =>
  encrypted.reduce((acc, value, index) => {
    acc[mixed[index]] = value;
    return acc;
  }, []);

const wrapIndex = (index, length) => ((index % length) + length) % length;

const swapRight = (array, startIndex, endIndex) =>
  array.map((x) => {
    if (x < startIndex || x > endIndex) {
      return x;
    }
    if (x === startIndex) {
      return endIndex;
    }
    return x - 1;
  });

const swapLeft = (array, startIndex, endIndex) => {
  const toReturn = [...array];
  for (let index = startIndex - 1; index >= endIndex; index--) {
    toReturn[index] += 1;
  }
  toReturn[startIndex] = endIndex;
  return toReturn;
};

const moveNumber = (array, startIndex, endIndex) => {
  if (startIndex === endIndex) {
    return array;
  }

  return startIndex < endIndex
    ? swapRight(array, startIndex, endIndex)
    : swapLeft(array, startIndex, endIndex);
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  console.log();
  const encrypted = parseInput(lines);
  const { length } = encrypted;
  let mixed = encrypted.map((_, index) => index);

  console.log('original:', arrayToString(encrypted));

  for (let index = 0; index < length; index++) {
    const number = encrypted[index];
    console.group(`number: ${number}`);
    const currentIndex = mixed[index];
    const destIndex = wrapIndex(currentIndex + number, length);
    console.log(`startIndex: ${currentIndex}, destIndex: ${destIndex}`);
    mixed = moveNumber(mixed, currentIndex, destIndex);
    console.log(`mixed: ${arrayToString(mixed)}`);
    console.log(`decrp: ${arrayToString(decrypt(encrypted, mixed))}`);
    console.groupEnd();
  }

  return 10;
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
