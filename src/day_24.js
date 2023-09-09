/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */

import { convertTo2dArray, index2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { Vector2 } from './util/vector2.js';

const render = (() => {
  const bitToChar = {
    0x0: '.',
    0x1: '^',
    0x2: 'v',
    0x3: 2,
    0x4: '>',
    0x5: 2,
    0x6: 2,
    0x7: 3,
    0x8: '<',
    0x9: 2,
    0xa: 2,
    0xb: 3,
    0xc: 2,
    0xd: 3,
    0xe: 3,
    0xf: 4,
  };
  return (map, expedition) => {
    console.log(
      array2dToString(map, (char, y, x) =>
        y === expedition.y && x === expedition.x ? 'E' : bitToChar[char]
      )
    );
  };
})();

/**
 * The bit masks used to represent the various characters on the map.
 */
const bits = {
  empty: 0b0000,
  blizzardUp: 0b0001,
  blizzardDown: 0b0010,
  blizzardRight: 0b0100,
  blizzardLeft: 0b1000,
};

const parseMap = (lines) => {
  // maps an input character to the bitfield which represents that character.
  const inputCharMap = {
    '.': bits.empty,
    '^': bits.blizzardUp,
    v: bits.blizzardDown,
    '>': bits.blizzardRight,
    '<': bits.blizzardLeft,
  };
  // create a new array removing the bordering tiles on the outer edge of the map.
  const trimmed = lines.slice(1, -1).map((line) => line.slice(1, -1));
  return convertTo2dArray(trimmed, (char) => inputCharMap[char]);
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = async ({ lines }) => {
  const map = parseMap(lines);
  const expeditionPosition = new Vector2(0, 0);
  render(map, expeditionPosition);
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
