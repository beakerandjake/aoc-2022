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

const moveRight = (array, startIndex, endIndex) => {
  const toReturn = array.map((index) =>
    index > startIndex || index <= endIndex ? wrapIndex(index - 1, array.length) : index
  );
  toReturn[startIndex] = endIndex;
  return toReturn;
};

const moveLeft = (array, startIndex, endIndex) => {};

const moveNumber = (array, startIndex, endIndex) => {
  if (startIndex === endIndex) {
    return array;
  }

  return [];
};

const findCoordinates = (mixed) => {
  const indexOfZero = mixed.findIndex((x) => x === 0);
  const a = mixed[(indexOfZero + 1000) % mixed.length];
  const b = mixed[(indexOfZero + 2000) % mixed.length];
  const c = mixed[(indexOfZero + 3000) % mixed.length];
  return a + b + c;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  console.log();
  const encrypted = [1, 2, 3, -2, -3, 0, 4];
  let mixed = encrypted.map((_, index) => index);
  mixed = moveRight(mixed, 2, wrapIndex(2 + 3, mixed.length));
  console.log(`before: ${arrayToString(encrypted)}`);
  console.log(`after: ${arrayToString(decrypt(encrypted, mixed))}`);
  return 10;

  // console.log();
  // const encrypted = parseInput(lines);
  // let mixed = encrypted.map((_, index) => index);

  // console.log('original:', arrayToString(encrypted));

  // // wrap around in either direction causing issue with shifting, off by one.
  // // overcomplicating it? instead of reversing direction on wrap around
  // // if negative always left shift until at target, positive always right shift

  // for (let index = 0; index < mixed.length; index++) {
  //   const number = encrypted[index];
  //   console.group(`number: ${number}`);
  //   const currentIndex = mixed[index];
  //   const destIndex = wrapIndex(currentIndex + number, mixed.length);
  //   console.log(`startIndex: ${currentIndex}, destIndex: ${destIndex}`);
  //   console.log(`before: ${arrayToString(decrypt(encrypted, mixed))}`);
  //   mixed = moveNumber(mixed, currentIndex, destIndex);
  //   console.log(`mixed: ${arrayToString(mixed)}`);
  //   console.log(`decrp: ${arrayToString(decrypt(encrypted, mixed))}`);
  //   console.groupEnd();
  // }

  // return findCoordinates(mixed);
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
