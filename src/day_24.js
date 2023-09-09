/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */

import { convertTo2dArray, index2d, map2d } from './util/array2d.js';
import { binaryToString } from './util/bitwise.js';
import { array2dToString } from './util/debug.js';
import { invert } from './util/object.js';

const bits = {
  empty: 0,
  blizzardUp: 1,
  blizzardDown: 1 << 1,
  blizzardRight: 1 << 2,
  blizzardLeft: 1 << 3,
  boundary: 1 << 4,
};

const charToBit = {
  '.': bits.empty,
  '^': bits.blizzardUp,
  v: bits.blizzardDown,
  '>': bits.blizzardRight,
  '<': bits.blizzardLeft,
  '#': bits.boundary,
};

const render = (array) => {
  const bitToChar = {
    ...invert(charToBit),
    0xf: 4,
    0xe: 3,
    0xd: 3,
    0xc: 2,
    0xb: 3,
    0xa: 2,
    0x9: 2,
    0x7: 3,
    0x6: 2,
    0x5: 2,
    0x3: 2,
  };
  const toString = array2dToString(array, (char) => bitToChar[char] || '?');
  console.log(toString);
};

const parseMap = (lines) => {
  convertTo2dArray(lines, (char) => charToBit[char]);
}

const moveBlizzards = (map) => {
  const copy = [...map.items];
  const yMax = map.shape.height - 1;
  const xMax = map.shape.height - 1;
  for (let y = 1; y < yMax; y++) {
    for (let x = 1; x < xMax; x++) {
      const index = index2d(map.shape.height, y, x);
      copy[index] = '@';
    }
  }
  return { ...map, items: copy };
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const map = parseMap(lines);
  render(map);
  const moved = moveBlizzards(map);
  render(moved);
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
