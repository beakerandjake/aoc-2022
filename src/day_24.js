/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */

import { convertTo2dArray } from './util/array2d.js';

const bitIndex = {
  blizzardNorth: 0,
  blizzardEast: 1,
  blizzardWest: 2,
  blizzardSouth: 3,
  boundary: 
};

const parseMap = (lines) => {
  const height = lines.length;
  const width = lines[0].length;
  return convertTo2dArray(lines, (char, y, x) => {
    if (char === '#') {
      return '&';
    }
    return char;
  });
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const map = parseMap(lines);
  console.log(map);
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
