/**
 * Contains solutions for Day 15
 * Puzzle Description: https://adventofcode.com/2022/day/15
 */

import { toSet, bounds } from './util/array.js';
import { toNumber } from './util/string.js';
import { Vector2, taxicabDistance, add } from './util/vector2.js';

/**
 * Parse a regex match and returns a new Vector2.
 */
const parseMatch = (match) => new Vector2(toNumber(match[1]), toNumber(match[2]));

/**
 * Parse a single line of input and returns the sensor and closest beacon.
 */
const parseLine = (line) => {
  const [sensorMatch, beaconMatch] = line.matchAll(/x=(-?\d+), y=(-?\d+)/g);
  return {
    sensorPosition: parseMatch(sensorMatch),
    beaconPosition: parseMatch(beaconMatch),
  };
};

/**
 * Calculates the extremities of the sensor based on the distance to the closest beacon.
 */
const calculateSensorRange = ({ sensorPosition, beaconPosition }) => {
  const distanceToBeacon = taxicabDistance(sensorPosition, beaconPosition);
  return {
    position: sensorPosition,
    distanceToBeacon: taxicabDistance(sensorPosition, beaconPosition),
    left: sensorPosition.x - distanceToBeacon,
    right: sensorPosition.x + distanceToBeacon,
    top: sensorPosition.y - distanceToBeacon,
    bottom: sensorPosition.y + distanceToBeacon,
  };
};

/**
 * Creates a lookup of beacon positions.
 */
const createBeaconLookup = (items) =>
  toSet(items, ({ beaconPosition }) => beaconPosition.toString());

/**
 * Parses the input and returns the sensors and beacon positions.
 */
const parseLines = (lines) => {
  const parsed = lines.map(parseLine);
  const sensors = parsed.map(calculateSensorRange);
  const beacons = createBeaconLookup(parsed);
  return { sensors, beacons };
};

/**
 * Finds the left/right extremities of the world based on all sensors.
 */
const findWorldBounds = (sensors) =>
  bounds(sensors.reduce((acc, { left, right }) => [...acc, left, right], []));

/**
 * Is the position within range of the sensor?
 */
const inRangeOfSensor = (position, sensor) =>
  taxicabDistance(position, sensor.position) <= sensor.distanceToBeacon;

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Returns true if the position cannot contain the distress beacon.
   */
  const positionIsOccupied = (position, sensors, beacons) =>
    sensors.some((sensor) => inRangeOfSensor(position, sensor)) &&
    !beacons.has(position.toString());

  /**
   * Returns the number of positions in the row which cannot contain the distress beacon.
   */
  const countOccupiedPositions = (rowNumber, sensors, beacons, left, right) => {
    let occupiedCount = 0;
    const position = new Vector2(left, rowNumber);
    while (position.x++ <= right) {
      if (positionIsOccupied(position, sensors, beacons)) {
        occupiedCount += 1;
      }
    }
    return occupiedCount;
  };

  return ({ lines }) => {
    const { sensors, beacons } = parseLines(lines);
    const [left, right] = findWorldBounds(sensors);
    return countOccupiedPositions(2000000, sensors, beacons, left, right);
  };
})();

const positionIsEmpty = (position, sensors, beacons) =>
  sensors.every(
    ({ position: sensorPosition, distanceToBeacon }) =>
      taxicabDistance(position, sensorPosition) > distanceToBeacon
  ) && !beacons.has(position.toString());

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  const { sensors, beacons } = parseLines(lines);
  console.log([...beacons].join('\n'));

  // your code here
  for (let x = 0; x <= 20; x++) {
    for (let y = 0; y <= 20; y++) {
      const position = new Vector2(x, y);
      if (positionIsEmpty(position, sensors, beacons)) {
        console.log('found position', position.toString());
        return position.x * 4000000 + position.y;
      }
    }
  }
  return 1234;
};
