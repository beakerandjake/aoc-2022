/**
 * Contains solutions for Day 15
 * Puzzle Description: https://adventofcode.com/2022/day/15
 */

import { toNumber } from './util/string.js';
import { Vector2, taxicabDistance, findBounds, add } from './util/vector2.js';

/**
 * Parse a regex match and returns a new Vector2.
 */
const parseMatch = (match) => new Vector2(toNumber(match[1]), toNumber(match[2]));

/**
 * Parse a single line of input and return information relating to the sensor and closest beacon.
 */
const parseLine = (line) => {
  const [sensorMatch, beaconMatch] = line.matchAll(/x=(-?\d+), y=(-?\d+)/g);
  const sensorPosition = parseMatch(sensorMatch);
  const beaconPosition = parseMatch(beaconMatch);
  const distanceToBeacon = taxicabDistance(sensorPosition, beaconPosition);
  return {
    sensorPosition,
    beaconPosition,
    distanceToBeacon,
    bounds: [
      add(sensorPosition, new Vector2(-distanceToBeacon, 0)),
      add(sensorPosition, new Vector2(distanceToBeacon, 0)),
      add(sensorPosition, new Vector2(0, -distanceToBeacon)),
      add(sensorPosition, new Vector2(0, distanceToBeacon)),
    ],
  };
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  // your code here
  const sensors = lines.map(parseLine);
  const bounds = findBounds(
    sensors.reduce((acc, item) => {
      acc.push(...item.bounds);
      return acc;
    }, [])
  );
  const beaconPositions = new Set(
    sensors.map(({ beaconPosition }) => beaconPosition.toString())
  );

  const rowNumber = 2000000;
  let occupiedCount = 0;
  for (let x = bounds.left; x <= bounds.right; x++) {
    const position = new Vector2(x, rowNumber);
    const occupied = sensors.some(
      ({ sensorPosition, distanceToBeacon }) =>
        taxicabDistance(position, sensorPosition) <= distanceToBeacon &&
        !beaconPositions.has(position.toString())
    );
    if (occupied) {
      occupiedCount += 1;
    }
  }

  return occupiedCount;
  // return 1234;
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
