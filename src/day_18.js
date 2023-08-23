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
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
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
    return sum(cubes.map((cube) => countExposedSides(cube, lookup)));
  };
})();

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const rayCast = (origin, direction, distance, lavaDroplet) => {
    let traveled = 0;
    let current = origin;
    while (traveled++ <= distance) {
      if (lavaDroplet.has(current.toString())) {
        return true;
      }
      current = add(current, direction);
    }
    return false;
  };

  const exposedLeft = (xBounds, yBounds, zBounds, lavaDroplet) => {
    let exposedCount = 0;
    const distance = zBounds[1] - zBounds[0];
    for (let z = zBounds[0]; z <= zBounds[1]; z++) {
      for (let y = yBounds[0]; y <= yBounds[1]; y++) {
        if (rayCast(new Vector3(xBounds[0], y, z), right, distance, lavaDroplet)) {
          exposedCount += 1;
        }
      }
    }
    return exposedCount;
  };

  const exposedRight = (xBounds, yBounds, zBounds, lavaDroplet) => {
    let exposedCount = 0;
    const distance = zBounds[1] - zBounds[0];
    for (let z = zBounds[0]; z <= zBounds[1]; z++) {
      for (let y = yBounds[0]; y <= yBounds[1]; y++) {
        if (rayCast(new Vector3(xBounds[1], y, z), left, distance, lavaDroplet)) {
          exposedCount += 1;
        }
      }
    }
    return exposedCount;
  };

  const exposedTop = (xBounds, yBounds, zBounds, lavaDroplet) => {
    let exposedCount = 0;
    const distance = yBounds[1] - yBounds[0];
    for (let z = zBounds[0]; z <= zBounds[1]; z++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        if (rayCast(new Vector3(x, yBounds[1], z), down, distance, lavaDroplet)) {
          exposedCount += 1;
        }
      }
    }
    return exposedCount;
  };

  const exposedBottom = (xBounds, yBounds, zBounds, lavaDroplet) => {
    let exposedCount = 0;
    const distance = yBounds[1] - yBounds[0];
    for (let z = zBounds[0]; z <= zBounds[1]; z++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        if (rayCast(new Vector3(x, yBounds[0], z), up, distance, lavaDroplet)) {
          exposedCount += 1;
        }
      }
    }
    return exposedCount;
  };

  const exposedFront = (xBounds, yBounds, zBounds, lavaDroplet) => {
    let exposedCount = 0;
    const distance = zBounds[1] - zBounds[0];
    for (let y = yBounds[0]; y <= yBounds[1]; y++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        if (rayCast(new Vector3(x, y, zBounds[0]), back, distance, lavaDroplet)) {
          exposedCount += 1;
        }
      }
    }
    return exposedCount;
  };

  const exposedBack = (xBounds, yBounds, zBounds, lavaDroplet) => {
    let exposedCount = 0;
    const distance = zBounds[1] - zBounds[0];
    for (let y = yBounds[0]; y <= yBounds[1]; y++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        if (rayCast(new Vector3(x, y, zBounds[1]), forward, distance, lavaDroplet)) {
          exposedCount += 1;
        }
      }
    }
    return exposedCount;
  };

  return ({ lines }) => {
    const cubes = parseInput(lines);
    const lookup = cubeLookup(cubes);
    const xBounds = bounds(cubes.map(({ x }) => x));
    const yBounds = bounds(cubes.map(({ y }) => y));
    const zBounds = bounds(cubes.map(({ z }) => z));
    const counts = [
      exposedLeft(xBounds, yBounds, zBounds, lookup),
      exposedRight(xBounds, yBounds, zBounds, lookup),
      exposedTop(xBounds, yBounds, zBounds, lookup),
      exposedBottom(xBounds, yBounds, zBounds, lookup),
      exposedFront(xBounds, yBounds, zBounds, lookup),
      exposedBack(xBounds, yBounds, zBounds, lookup),
    ];
    return sum(counts);
  };
})();
