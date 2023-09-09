/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */

import { convertTo2dArray, index2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { invert } from './util/object.js';
import { Vector2 } from './util/vector2.js';

const bits = {
  empty: 0b0000,
  blizzardUp: 0b0001,
  blizzardDown: 0b0010,
  blizzardRight: 0b0100,
  blizzardLeft: 0b1000,
};

const charToBitfield = {
  '.': bits.empty,
  '^': bits.blizzardUp,
  v: bits.blizzardDown,
  '>': bits.blizzardRight,
  '<': bits.blizzardLeft,
};

const render = (() => {
  const bitToChar = {
    ...invert(charToBitfield),
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
  return (map, expedition) => {
    console.log(
      array2dToString(map, (char, y, x) =>
        y === expedition.y && x === expedition.x ? 'E' : bitToChar[char]
      )
    );
  };
})();

const parseMap = (lines) =>
  convertTo2dArray(
    // remove the walls from the input array.
    lines.slice(1, -1).map((line) => line.slice(1, -1)),
    (char) => charToBitfield[char]
  );

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const map = parseMap(lines);
  const expeditionPosition = new Vector2(3, 2);
  render(map, expeditionPosition);
  map.items[5] = 0xf;
  render(map, expeditionPosition);
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
