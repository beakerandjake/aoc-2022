/**
 * Contains solutions for Day 18
 * Puzzle Description: https://adventofcode.com/2022/day/18
 */
import { Vector3, up, down, left, right, forward, back, add } from './util/vector3.js';
import { bounds, sum } from './util/array.js';
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
 * Returns the positions of each side surrounding the cube which are exposed.
 */
const getExposedSides = (cube, lookup) =>
  sides.map((side) => add(cube, side)).filter((side) => !lookup.has(side.toString()));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const cubes = parseInput(lines);
  const lookup = cubeLookup(cubes);
  return sum(cubes.map((cube) => getExposedSides(cube, lookup).length));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const getAllExposedSides = (cubes, lookup) => {
    const exposed = cubes.map((cube) => getExposedSides(cube, lookup));
    const z = exposed.reduce((acc, points) => {
      points
        .map((point) => point.toString())
        .forEach((key) => {
          acc[key] = acc[key] ? acc[key] + 1 : 1;
        });
      return acc;
    }, {});
    const q = Object.values(z).filter((x) => x >= 6);
    return sum(q);
  };

  /**
   * Return the count of the cubes sides which are not covered by another cube.
   */
  const countExposedSides = (cube, lookup) =>
    sides
      .map((side) => add(cube, side).toString())
      .reduce((acc, side) => (lookup.has(side) ? acc : acc + 1), 0);

  return ({ lines }) => {
    const cubes = parseInput(lines);
    const lookup = cubeLookup(cubes);
    return getAllExposedSides(cubes, lookup);
  };
})();
