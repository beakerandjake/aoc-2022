import {
  parse2dArray,
  elementAt2d,
  index2d,
  inRange,
  cardinalNeighbors2d,
  forEach2d,
  indexToCoordinate2d,
  minBy,
} from './util.js';

/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2022/day/12
 */

const isStartNode = (value) => value === 'S';

const isEndNode = (value) => value === 'E';

const findClosestUnvisitedNode = (nodes) => minBy(nodes, (x) => x.tentativeDistance);

const distance = (from, to) => {
  if (isEndNode(to)) {
    return 0;
  }

  if (to < from) {
    return 1;
  }

  return to - from;
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
  const unvisited = items.map((item, index) => ({
    position: indexToCoordinate2d(shape.width, index),
    value: item,
    charCode: item.charCodeAt(),
    tentativeDistance: isStartNode(item) ? 0 : Number.MAX_SAFE_INTEGER,
  }));

  let current = findClosestUnvisitedNode(unvisited);
  const neighbors = cardinalNeighbors2d(items, shape)
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
