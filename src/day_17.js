/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { range } from './util/array.js';
import { Vector2, add, equals } from './util/vector2.js';

const shapeTemplates = [
  // ####
  [new Vector2(0, 0), new Vector2(1, 0), new Vector2(2, 0), new Vector2(3, 0)],
  // .#.
  // ###
  // .#.
  [
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(1, 1),
    new Vector2(2, 1),
    new Vector2(1, 2),
  ],
  // ..#
  // ..#
  // ###
  [
    new Vector2(2, 2),
    new Vector2(2, 1),
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(2, 0),
  ],
  // #
  // #
  // #
  // #
  [new Vector2(0, 0), new Vector2(0, 1), new Vector2(0, 2), new Vector2(0, 3)],
];

/**
 * Parse the input and return the jet patterns.
 */
const parseInput = (input) => [...input].map((character) => (character === '>' ? 1 : -1));

const collides = (position, shape) =>
  shape.some((shapePosition) => equals(position, shapePosition));

const collidesWithAnyShape = (position, shapes) =>
  shapes.some((shape) => collides(position, shape));

const print = (() => {
  const border = '+-------+';

  const renderRow = (y, shapes) => {
    let row = '';
    for (let x = 0; x < 7; x++) {
      row += collidesWithAnyShape(new Vector2(x, y), shapes) ? '#' : '.';
    }
    return `|${row}|`;
  };

  return (rowStart, rowEnd, shapes) => {
    console.log(border);
    range(rowEnd - rowStart, rowStart)
      .map((y) => renderRow(y, shapes))
      .reverse()
      .forEach((line) => console.log(line));
    console.log(border);
  };
})();

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input }) => {
  console.log();
  console.log();
  const jetPatterns = parseInput(input);
  // console.log(renderRow(0, [shapeTemplates[2].map((x) => add(x, new Vector2(0, 0)))]));
  print(0, 10, [
    shapeTemplates[2],
    shapeTemplates[1].map((x) => add(x, new Vector2(1, 3))),
  ]);
  console.log();
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
