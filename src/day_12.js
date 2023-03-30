import {
  parse2dArray,
  elementAt2d,
  index2d,
  inRange,
  cardinalNeighbors2d,
  forEach2d,
  indexToCoordinate2d,
} from './util.js';

/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2022/day/12
 */

const isStartNode = (value) => value === 'S';
const isEndNode = (value) => value === 'E';

const findStartAndEnd = (items) => {
  const startAndEnd = items.filter((x) => isStartNode(x) || isEndNode(x));
  const startIndex = isStartNode(items[0]) ? 0 : 1;
  const endIndex = startIndex === 0 ? 1 : 0;
  return {
    start: startAndEnd[startIndex],
    end: startAndEnd[endIndex],
  };
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => {
  const { items, shape } = parse2dArray(input);
  const { start, end } = findStartAndEnd(items);
  const unvisited = items.map((item, index) => ({
    position: indexToCoordinate2d(shape.width, index),
    value: item,
  }));
  // console.log(unvisited);
  // const unvisited = items.map((x, index) => {
  //   console.log(x);

  //   return x;
  // });
  // const { start, end } = findStartAndEnd(items);

  // console.log('start', start, 'end', end);

  // console.log(items);

  return 1234;
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
