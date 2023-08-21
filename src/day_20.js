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

const moveNumber = (array, startIndex, endIndex) => {
  if (startIndex === endIndex) {
    return array;
  }
  const direction = startIndex > endIndex ? 1 : -1;
  return array.map((index) => {
    if (index < startIndex || index > endIndex) {
      return index;
    }
    if (index === startIndex) {
      return endIndex;
    }

    return index + direction;
  });
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

  // wrap around in either direction causing issue with shifting, off by one. 
  // overcomplicating it? instead of reversing direction on wrap around
  // if negative always left shift until at target, positive always right shift

  for (let index = 0; index < length; index++) {
    const number = encrypted[index];
    console.group(`number: ${number}`);
    const currentIndex = mixed[index];
    const destIndex = wrapIndex(currentIndex + number, length);
    console.log(`startIndex: ${currentIndex}, destIndex: ${destIndex}`);
    console.log(`before: ${arrayToString(decrypt(encrypted, mixed))}`);
    mixed = moveNumber(mixed, currentIndex, destIndex);
    console.log(`mixed: ${arrayToString(mixed)}`);
    console.log(`decrp: ${arrayToString(decrypt(encrypted, mixed))}`);
    console.groupEnd();
  }
  const indexOfZero = mixed.findIndex((x) => x === 0);
  const a = mixed[(indexOfZero + 1000) % length];
  const b = mixed[(indexOfZero + 2000) % length];
  const c = mixed[(indexOfZero + 3000) % length];
  return a + b + c;
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
