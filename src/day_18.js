/**
 * Contains solutions for Day 18
 * Puzzle Description: https://adventofcode.com/2022/day/18
 */
import {
  Vector3,
  findBounds,
  up,
  down,
  left,
  right,
  forward,
  back,
  add,
} from './util/vector3.js';
import { sum } from './util/array.js';
import { toNumber } from './util/string.js';

const parseLine = (line) => new Vector3(...line.split(',').map(toNumber));

const parseInput = (lines) => lines.map(parseLine);

const toLookup = (points) => new Set(points.map((x) => x.toString()));

const sides = [up, down, left, right, forward, back];

const getSides = (cube) => sides.map((side) => add(cube, side));

const getExposedSides = (cube, lookup) =>
  getSides(cube).filter((side) => !lookup.has(side.toString()));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const cubes = parseInput(lines);
  const cubeLookup = toLookup(cubes);
  return sum(cubes.map((cube) => getExposedSides(cube, cubeLookup).length));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const isOutOfBounds = ({ x, y, z }, bounds) =>
    x < bounds.left ||
    x > bounds.right ||
    y < bounds.bottom ||
    y > bounds.top ||
    z < bounds.back ||
    z > bounds.front;

  // Returns a lookup of all points which are within the world bounds but outside of the lava droplet.
  const getEmptyPoints = (bounds, lavaPoints) => {
    const queue = [new Vector3(bounds.left, bounds.bottom, bounds.back)];
    const examined = new Set();
    while (queue.length) {
      const point = queue.shift();
      const key = point.toString();
      if (examined.has(key) || isOutOfBounds(point, bounds) || lavaPoints.has(key)) {
        continue;
      }
      queue.push(...sides.map((side) => add(point, side)));
      examined.add(key);
    }
    return examined;
  };

  return ({ lines }) => {
    const cubes = parseInput(lines);
    const cubeLookup = toLookup(cubes);
    const worldBounds = findBounds(cubes);
    const outsideCube = getEmptyPoints(worldBounds, cubeLookup);

    const exposedToAirPockets = sum(
      cubes.map(
        (cube) =>
          getExposedSides(cube, cubeLookup).filter(
            (point) =>
              !isOutOfBounds(point, worldBounds) && !outsideCube.has(point.toString())
          ).length
      )
    );

    const totalExposed = sum(
      cubes.map((cube) => getExposedSides(cube, cubeLookup).length)
    );

    return totalExposed - exposedToAirPockets;
  };
})();
