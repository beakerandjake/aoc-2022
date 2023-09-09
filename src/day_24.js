/**
 * Contains solutions for Day 24
 * Puzzle Description: https://adventofcode.com/2022/day/24
 */
import { arraysEqual } from './util/array.js';
import {
  cardinalNeighborDeltas,
  convertTo2dArray,
  elementAt2d,
  inBounds,
  mapPoints,
} from './util/array2d.js';
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

/**
 * Returns a function which memoizes states it has encountered before.
 * When the returned function is invoked it returns true if the state has been previously encountered.
 */
const memoizeStates = () => {
  const encountered = new Set();
  return (current) => {
    const hash = `${current.time}.${current.position}`;
    if (encountered.has(hash)) {
      return true;
    }
    encountered.add(hash);
    return false;
  };
};

/**
 * Does the tile have a blizzard in it?
 */
const hasBlizzard = (map, { x, y }) => elementAt2d(map, y, x) !== 0;

/**
 * Returns the fewest number of minutes needed to move from the start position to the target position.
 */
const shortestPath = (blizzards, start, target, initialTime = 0) => {
  const queue = [{ position: start, time: initialTime }];
  const encountered = memoizeStates();
  while (queue.length) {
    const current = queue.shift();

    if (encountered(current)) {
      continue;
    }

    if (equals(current.position, target)) {
      return current.time - initialTime;
    }

    // get the state of the blizzards after they move this turn
    const map = blizzards[(current.time + 1) % blizzards.length];

    // if there won't be a blizzard at the current position, it's a valid option to stay put.
    if (equals(current.position, start) || !hasBlizzard(map, current.position)) {
      queue.push({ ...current, time: current.time + 1 });
    }

    // each tile that won't be occupied by a blizzard next turn is a valid option.
    const openNeighbors = cardinalNeighborDeltas
      .map((delta) => add(current.position, delta))
      .filter((neighbor) => inBounds(map.shape, neighbor) && !hasBlizzard(map, neighbor))
      .map((neighbor) => ({ position: neighbor, time: current.time + 1 }));
    queue.push(...openNeighbors);
  }

  return undefined;
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
  return [
    { start: worldTargets.start, goal: localTargets.goal },
    { start: worldTargets.goal, goal: localTargets.start },
    { start: worldTargets.start, goal: localTargets.goal },
  ].reduce(
    (total, { start, goal }) => total + shortestPath(blizzards, start, goal, total) + 1,
    0
  );
};
