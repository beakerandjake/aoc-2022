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
const calculateSensorRange = ({ sensorPosition, beaconPosition }) => ({
  position: sensorPosition,
  distanceToBeacon: taxicabDistance(sensorPosition, beaconPosition),
});

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
 * Is the position within range of the sensor?
 */
const inRangeOfSensor = (position, sensor) =>
  taxicabDistance(position, sensor.position) <= sensor.distanceToBeacon;

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Finds the left/right extremities of the world based on all sensors.
   */
  const findWorldBounds = (sensors) =>
    bounds(
      sensors.reduce(
        (acc, { position, distanceToBeacon }) => [
          ...acc,
          position.x - distanceToBeacon,
          position.x + distanceToBeacon,
        ],
        []
      )
    );

  /**
   * Returns true if the position cannot contain the distress beacon.
   */
  const positionIsOccupied = (position, sensors, beacons) =>
    sensors.some((sensor) => inRangeOfSensor(position, sensor)) &&
    !beacons.has(position.toString());

  /**
   * Returns the number of positions in the row which cannot contain the distress beacon.
   */
  const countOccupiedPositions = (rowNumber, sensors, beacons) => {
    const [left, right] = findWorldBounds(sensors);
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
    return countOccupiedPositions(2000000, sensors, beacons);
  };
})();

const positionIsEmpty = (position, sensors, beacons) =>
  sensors.every((sensor) => !inRangeOfSensor(position, sensor)) &&
  !beacons.has(position.toString());

const maxSensorRowLength = (distanceToBeacon) => distanceToBeacon * 2 + 1;

const sensorRowDecay = (sensorPosition, position) =>
  2 * Math.abs(sensorPosition.y - position.y);

const offsetXToEdgeOfSensor = (sensor, position) =>
  maxSensorRowLength(sensor.distanceToBeacon) - sensorRowDecay(sensor.position, position);

const teleportXToEdgeOfSensor = (sensor, position) =>
  new Vector2(position.x + offsetXToEdgeOfSensor(sensor, position), position.y);

const teleportToEdge = (position, sensor) => {};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ lines }) => {
  const { sensors, beacons } = parseLines(lines);

  const sensor = sensors.find((q) => q.position.x === 8 && q.position.y === 7);
  const positions = [
    new Vector2(8, -2),
    new Vector2(7, -1),
    new Vector2(6, 0),
    new Vector2(5, 1),
    new Vector2(4, 2),
    new Vector2(3, 3),
    new Vector2(2, 4),
    new Vector2(1, 5),
    new Vector2(0, 6),
    new Vector2(-1, 7),
    new Vector2(0, 8),
    new Vector2(1, 9),
    new Vector2(2, 10),
    new Vector2(3, 11),
    new Vector2(4, 12),
    new Vector2(5, 13),
    new Vector2(6, 14),
    new Vector2(7, 15),
    new Vector2(8, 16),
  ];
  positions.forEach((position) => {
    const newPosition = teleportXToEdgeOfSensor(sensor, position);
    console.log('position', position, 'newPosition', newPosition);
  });
  // for (let index = -2; index <= 7; index++) {
  //   const
  // }
  // console.log(sensor);

  // // your code here
  // for (let y = 1000; y >= 0; y--) {
  //   for (let x = 0; x <= 1000; x++) {
  //     const position = new Vector2(x, y);
  //     if (positionIsEmpty(position, sensors, beacons)) {
  //       return position.x * 4000000 + position.y;
  //     }
  //   }
  // }
  return 1234;
};
