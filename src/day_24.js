/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */
import { arraysEqual } from './util/array.js';
import { convertTo2dArray, elementAt2d, isInBounds, mapPoints } from './util/array2d.js';
import { mod } from './util/math.js';
import { Vector2, add, equals } from './util/vector2.js';

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
  // trimming this layer makes moving the blizzards easier but makes handing start/goal positions annoying.
  const trimmed = lines.slice(1, -1).map((line) => line.slice(1, -1));
  return convertTo2dArray(trimmed, (char) => inputCharMap[char]);
};

/**
 * Returns a new map with each blizzard having moved one unit in its movement direction.
 */
const moveBlizzards = (map) => {
  const { width, height } = map.shape;
  return mapPoints(map, (_, y, x) => {
    const up = elementAt2d(map, mod(y - 1, height), x) & bits.blizzardDown;
    const down = elementAt2d(map, mod(y + 1, height), x) & bits.blizzardUp;
    const left = elementAt2d(map, y, mod(x - 1, width)) & bits.blizzardRight;
    const right = elementAt2d(map, y, mod(x + 1, width)) & bits.blizzardLeft;
    return up | down | left | right;
  });
};

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

/**
 * Returns the start/goal positions in relation to the trimmed map.
 * These positions exist on the trimmed map and are one unit away from the 'real' targets.
 */
const getLocalTargets = ({ shape: { width, height } }) => ({
  start: new Vector2(0, 0),
  goal: new Vector2(width - 1, height - 1),
});

/**
 * Returns the start/goal positions in relation to the actual input map.
 * These positions do not exist on the trimmed map and are one unit way from the local targets.
 */
const getWorldTargets = ({ shape: { width, height } }) => ({
  start: new Vector2(0, -1),
  goal: new Vector2(width - 1, height),
});

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

const shortestPath = (blizzards, start, target, initialTime = 0) => {
  const queue = [{ position: start, time: initialTime }];
  let bestTime;
  const encountered = new Set();
  while (queue.length) {
    const current = queue.shift();

    if (equals(current.position, target)) {
      if (!bestTime || current.time < bestTime) {
        bestTime = current.time;
      }
      continue;
    }

    if (bestTime && current.time > bestTime) {
      continue;
    }

    const hash = `${current.time}.${current.position.toString()}`;
    if (encountered.has(hash)) {
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
      .filter((position) => isInBounds(currentMap.shape, position))
      .filter((position) => !hasBlizzard(currentMap, position))
      .map((position) => ({ position, time: current.time + 1 }));

    queue.push(...openNeighbors);
  }
  return bestTime;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const initialMap = parseMap(lines);
  const blizzards = blizzardTimeMap(initialMap);
  const { start } = getWorldTargets(initialMap);
  const { goal } = getLocalTargets(initialMap);
  const result = shortestPath(blizzards, start, goal);
  // add one to end time since the "target" is one away from the real exit (which lies off the map)
  return result + 1;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const initialMap = parseMap(lines);
  const blizzards = blizzardTimeMap(initialMap);
  const localTargets = getLocalTargets(initialMap);
  const worldTargets = getWorldTargets(initialMap);
  const one = shortestPath(blizzards, worldTargets.start, localTargets.goal) + 1;
  const two = shortestPath(blizzards, worldTargets.goal, localTargets.start, one) + 1;
  const three = shortestPath(blizzards, worldTargets.start, localTargets.goal, two) + 1;
  return one + (two - one) + (three - two);
};
