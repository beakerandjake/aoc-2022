/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */
import { convertTo2dArray, elementAt2d, map2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { Vector2, add, equals } from './util/vector2.js';
import { mod } from './util/math.js';
import { arraysEqual } from './util/array.js';

const mapToString = (() => {
  const bitToChar = {
    0x0: '.',
    0x1: '^',
    0x2: 'v',
    0x3: 2,
    0x4: '>',
    0x5: 2,
    0x6: 2,
    0x7: 3,
    0x8: '<',
    0x9: 2,
    0xa: 2,
    0xb: 3,
    0xc: 2,
    0xd: 3,
    0xe: 3,
    0xf: 4,
  };
  return (map, expedition = new Vector2(0, -1)) =>
    array2dToString(map, (char, y, x) =>
      y === expedition.y && x === expedition.x ? 'E' : bitToChar[char]
    );
})();

/**
 * The bit masks used to represent the various characters on the map.
 */
const bits = {
  empty: 0b0000,
  blizzardUp: 0b0001,
  blizzardDown: 0b0010,
  blizzardRight: 0b0100,
  blizzardLeft: 0b1000,
};

/**
 * Parse the input and return a 2d FlatArray
 */
const parseMap = (lines) => {
  // maps an input character to the bitfield which represents that character.
  const inputCharMap = {
    '.': bits.empty,
    '^': bits.blizzardUp,
    v: bits.blizzardDown,
    '>': bits.blizzardRight,
    '<': bits.blizzardLeft,
  };
  // create a new array removing the bordering tiles on the outer edge of the map.
  const trimmed = lines.slice(1, -1).map((line) => line.slice(1, -1));
  return convertTo2dArray(trimmed, (char) => inputCharMap[char]);
};

/**
 * Returns a new map with each blizzard having moved one unit in its movement direction.
 */
const moveBlizzards = (map) => {
  const { width, height } = map.shape;
  return map2d(map, (_, y, x) => {
    const up = elementAt2d(map, mod(y - 1, height), x) & bits.blizzardDown;
    const down = elementAt2d(map, mod(y + 1, height), x) & bits.blizzardUp;
    const left = elementAt2d(map, y, mod(x - 1, width)) & bits.blizzardRight;
    const right = elementAt2d(map, y, mod(x + 1, width)) & bits.blizzardLeft;
    return up | down | left | right;
  });
};

const hasBlizzard = (map, { x, y }) => {
  if ((x < 0 && x >= map.shape.width) || y < 0 || y >= map.shape.height) {
    return false;
  }
  return elementAt2d(map, y, x) !== 0;
};

const neighbors = [
  new Vector2(0, -1),
  new Vector2(0, 1),
  new Vector2(1, 0),
  new Vector2(-1, 0),
];

/**
 * Create an array which can return the map at the current time
 */
const blizzardTimeMap = (map) => {
  let current = moveBlizzards(map);
  const toReturn = [map];
  // blizzards move in a cycle, they will eventually repeat start state.
  while (!arraysEqual(current.items, map.items)) {
    toReturn.push(current);
    current = moveBlizzards(current);
  }
  return toReturn;
};

const minTimeToReachDestination = (map, start, target, time = 0) => {
  const blizzards = blizzardTimeMap(map);
  const { width, height } = map.shape;
  const queue = [{ position: start, time }];
  let best;
  const encountered = new Set();
  while (queue.length) {
    const current = queue.shift();

    if (equals(current.position, target)) {
      if (!best || current.time < best.time) {
        best = current;
      }
      continue;
    }

    if (best && current.time > best.time) {
      continue;
    }

    const hash = `${current.time}.${current.position.toString()}`;
    if (encountered.has(hash) && !equals(start, current.position)) {
      continue;
    } else {
      encountered.add(hash);
    }

    const currentMap = blizzards[(current.time + 1) % blizzards.length];

    // if there won't be a blizzard at the current position, it's a valid option to stay put.
    if (!hasBlizzard(currentMap, current.position)) {
      queue.push({ ...current, time: current.time + 1 });
    }

    // each tile that won't be occupied by a blizzard next turn is a valid option.
    const openNeighbors = neighbors
      .map((delta) => add(current.position, delta))
      .filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height)
      .filter((position) => !hasBlizzard(currentMap, position))
      .map((position) => ({ position, time: current.time + 1 }));

    queue.push(...openNeighbors);
  }
  return best || { time: 0 };
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const map = parseMap(lines);
  const startPosition = new Vector2(0, -1);
  const targetPosition = new Vector2(map.shape.width - 1, map.shape.height - 1);
  const result = minTimeToReachDestination(map, startPosition, targetPosition);
  // add one to end time since the "target" is one away from the real exit (which lies off the map)
  return result ? result.time + 1 : undefined;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  const map = parseMap(lines);
  const entrance = new Vector2(0, -1);
  const goal = new Vector2(map.shape.width - 1, map.shape.height - 1);
  const one = minTimeToReachDestination(map, entrance, goal).time + 1;
  const two =
    minTimeToReachDestination(
      map,
      new Vector2(map.shape.width - 1, map.shape.height),
      new Vector2(0, 0),
      one
    ).time + 1;
  const three = minTimeToReachDestination(map, entrance, goal, two).time + 1;
  // add one to end time since the "target" is one away from the real exit (which lies off the map)
  return one + (two - one) + (three - two);
};
