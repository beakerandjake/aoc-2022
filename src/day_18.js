/**
 * Contains solutions for Day 18
 * Puzzle Description: https://adventofcode.com/2022/day/18
 */
import {
  Vector3,
  findBounds,
  isOutOfBounds,
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
  const droplet = parseInput(lines);
  const dropletLookup = toLookup(droplet);
  return sum(droplet.map((cube) => getExposedSides(cube, dropletLookup).length));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const getEmptyPoints = (worldBounds, lavaPoints) => {
    const queue = [new Vector3(worldBounds.left, worldBounds.bottom, worldBounds.back)];
    const empty = new Set();
    while (queue.length) {
      const point = queue.shift();
      const key = point.toString();
      if (!empty.has(key) && !isOutOfBounds(point, worldBounds) && !lavaPoints.has(key)) {
        empty.add(key);
        queue.push(...sides.map((side) => add(point, side)));
      }
    }
    return empty;
  };

  const sideIsExterior = (side, worldBounds, emptyPoints) =>
    isOutOfBounds(side, worldBounds) || emptyPoints.has(side.toString());

  return ({ lines }) => {
    const droplet = parseInput(lines);
    const dropletLookup = toLookup(droplet);
    const worldBounds = findBounds(droplet);
    const emptyPointsLookup = getEmptyPoints(worldBounds, dropletLookup);
    return droplet
      .flatMap((cube) => getExposedSides(cube, dropletLookup))
      .filter((side) => sideIsExterior(side, worldBounds, emptyPointsLookup)).length;
  };
})();
