/**
 * Contains solutions for Day 18
 * Puzzle Description: https://adventofcode.com/2022/day/18
 */
import { Vector3, up, down, left, right, forward, back, add } from './util/vector3.js';
import { arrayToString } from './util/array.js';
import { toNumber } from './util/string.js';

/**
 * Parse a single line of input and return a new Vector3.
 */
const parseLine = (line) => new Vector3(...line.split(',').map(toNumber));

/**
 * Parse each line of input and return the positions of the cubes.
 */
const parseInput = (lines) => lines.map(parseLine);

/**
 * Returns a set containing the position of each cube.
 */
const cubeLookup = (cubes) =>
  cubes.reduce((acc, x) => {
    acc.add(x.toString());
    return acc;
  }, new Set());

/**
 * Vectors which can be added to a cubes position to return the position adjacent to each face of the cube.
 */
const sides = [up, down, left, right, forward, back];

/**
 * Return the count of the cubes sides which are not covered by another cube.
 */
const exposedSideCount = (cube, lookup) =>
  sides
    .map((side) => add(cube, side).toString())
    .reduce((acc, side) => (lookup.has(side) ? acc : acc + 1), 0);

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const cubes = parseInput(lines);
  const lookup = cubeLookup(cubes);
  return cubes.reduce((acc, cube) => acc + exposedSideCount(cube, lookup), 0);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
