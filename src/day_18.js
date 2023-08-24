/**
 * Contains solutions for Day 18
 * Puzzle Description: https://adventofcode.com/2022/day/18
 */
import { Vector3, up, down, left, right, forward, back, add } from './util/vector3.js';
import { bounds, sum } from './util/array.js';
import { toNumber } from './util/string.js';

const parseLine = (line) => new Vector3(...line.split(',').map(toNumber));

const parseInput = (lines) => lines.map(parseLine);

const pointLookup = (points) => new Set(points.map((x) => x.toString()));

const sides = [up, down, left, right, forward, back];

const getExposedSides = (cube, lookup) =>
  sides.map((side) => add(cube, side)).filter((side) => !lookup.has(side.toString()));

export const levelOne = ({ lines }) => {
  const cubes = parseInput(lines);
  const lookup = pointLookup(cubes);
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
    const q = Object.values(z).filter((x) => x !== 6);
    return sum(q);
  };

  /**
   * Return the count of the cubes sides which are not covered by another cube.
   */
  const countExposedSides = (cube, lookup) =>
    sides
      .map((side) => add(cube, side).toString())
      .reduce((acc, side) => (lookup.has(side) ? acc : acc + 1), 0);

  const findBounds = (cubes) => {
    const [xMin, xMax] = bounds(cubes.map(({ x }) => x));
    const [yMin, yMax] = bounds(cubes.map(({ y }) => y));
    const [zMin, zMax] = bounds(cubes.map(({ z }) => z));
    return {
      left: xMin,
      right: xMax,
      bottom: yMin,
      top: yMax,
      back: zMin,
      front: zMax,
    };
  };

  const pointIsOutsideWorld = (point, worldBounds) => {
    if (point.x < worldBounds.left || point.x > worldBounds.right) {
      return true;
    }
    if (point.y < worldBounds.bottom || point.y > worldBounds.top) {
      return true;
    }
    if (point.z < worldBounds.back || point.z > worldBounds.front) {
      return true;
    }
    return false;
  };

  const pointsOutsideCube = (worldBounds, lookup) => {
    const queue = [new Vector3(worldBounds.left, worldBounds.bottom, worldBounds.back)];
    const examined = new Set();
    const toReturn = [];
    while (queue.length) {
      const point = queue.shift();
      const pointKey = point.toString();

      if (examined.has(pointKey)) {
        continue;
      }

      if (!pointIsOutsideWorld(point, worldBounds) && !lookup.has(point.toString())) {
        examined.add(pointKey);
        toReturn.push(point);
        queue.push(add(point, left));
        queue.push(add(point, right));
        queue.push(add(point, down));
        queue.push(add(point, up));
        queue.push(add(point, forward));
        queue.push(add(point, back));
      }
    }
    return toReturn;
  };

  return ({ lines }) => {
    const cubes = parseInput(lines);
    const lookup = pointLookup(cubes);
    const worldBounds = findBounds(cubes);
    const outsideCube = pointsOutsideCube(worldBounds, lookup);
    console.log('outside cube', outsideCube.length);
    console.log('cube', cubes.length);
    // for (let x = xMin; x <= xMax; x++) {
    //   for (let y = yMin; y <= yMax; y++) {
    //     for (let z = zMin; z <= zMax; z++) {
    //       console.
    //     }
    //   }
    // }

    // have a world cube of x*y*z, every point on the cube is either empty space, a point of lava or an air pocket inside of lava.
    // start from outer boundaries and flood fill all empty space outside of lava..
    // if a point is not flood filled and is not part of lava, then it must be an air pocket.
    // once know air pocket locations, can ignore exposed edges which touch an air pocket.

    return 1234;
  };
})();
