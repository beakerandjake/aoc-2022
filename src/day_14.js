import { toNumber } from './util/string.js';
import { Vector2, equals, add, down, downLeft, downRight } from './util/vector2.js';

/**
 * Contains solutions for Day 14
 * Puzzle Description: https://adventofcode.com/2022/day/14
 */

/**
 * Parse all lines of input and return all of the rocks in the cave.
 */
const parseLines = (() => {
  const coordinateRegex = /(\d+),(\d+)/g;
  /**
   * Parses a single line of input and returns the scan trace.
   */
  const parseLine = (line) =>
    [...line.matchAll(coordinateRegex)].map(
      ([, x, y]) => new Vector2(toNumber(x), toNumber(y))
    );

  /**
   * Returns an array of all numbers between the start and end (excluding start and end).
   */
  const numbersInBetween = (a, b) => {
    const max = Math.max(a, b);
    const toReturn = [];
    let current = Math.min(a, b);
    while (++current < max) {
      toReturn.push(current);
    }
    return toReturn;
  };

  /**
   * Returns an array containing all rocks between the start and the end (excluding start and end).
   */
  const expandPath = (start, end) =>
    start.x === end.x
      ? numbersInBetween(start.y, end.y).map((y) => new Vector2(start.x, y))
      : numbersInBetween(start.x, end.x).map((x) => new Vector2(x, start.y));

  /**
   * Returns all points by recursively tracing each point of the path backwards.
   */
  const tracePath = (path, idx) =>
    idx === 0
      ? [path[idx]]
      : [path[idx], ...expandPath(path[idx], path[idx - 1]), ...tracePath(path, idx - 1)];

  /**
   * Returns an array containing all rocks in the given path.
   */
  const getAllRocksInPath = (path) => tracePath(path, path.length - 1);

  return (lines) =>
    lines.reduce((acc, line) => [...acc, ...getAllRocksInPath(parseLine(line))], []);
})();

const print = (sandSource, rockLookup, sandLookup, bounds) => {
  const render = (position) => {
    if (rockLookup.has(position)) {
      return '#';
    }
    if (position === sandSource.toString()) {
      return '+';
    }
    if (sandLookup.has(position)) {
      return 'o';
    }
    return '.';
  };
  console.log();
  for (let y = bounds.bottom; y <= bounds.top; y++) {
    const line = [];
    for (let x = bounds.left; x <= bounds.right; x++) {
      line.push(render(new Vector2(x, y).toString()));
    }
    console.log(line.join(''));
  }
};

/**
 * Is the position blocked by a rock or sand?
 */
const isBlocked = (positionString, rockLookup, sandLookup) =>
  rockLookup.has(positionString) || sandLookup.has(positionString);

/**
 * Returns the extremes of the given positions.
 */
const findBounds = (positions) => {
  const bounds = (values) => [Math.min(...values), Math.max(...values)];
  const [left, right] = bounds(positions.map(({ x }) => x));
  const [bottom, top] = bounds(positions.map(({ y }) => y));
  return { left, right, bottom, top };
};

/**
 * Is the given position out of the bounds?
 */
const outOfBounds = (position, bounds) => {
  if (position.y < bounds.bottom || position.y > bounds.top) {
    return true;
  }
  if (position.x > bounds.right || position.x < bounds.left) {
    return true;
  }
  return false;
};

/**
 * Move the sand until it comes to rest. If the sand cannot move the original position is returned.
 */
const moveSand = (position, rockLookup, sandLookup) => {
  // move down first.
  let desired = add(position, down);
  // if blocked move down left.
  if (isBlocked(desired.toString(), rockLookup, sandLookup)) {
    desired = add(position, downLeft);
  }
  // if block move down right.
  if (isBlocked(desired.toString(), rockLookup, sandLookup)) {
    desired = add(position, downRight);
  }
  // if blocked, sand is at rest, return original position.
  return isBlocked(desired.toString(), rockLookup, sandLookup) ? position : desired;
};

/**
 * Move a particle of sand from the source until it either comes to rest
 * or falls out of bounds.
 */
const produceSand = (source, rockLookup, sandLookup, bounds) => {
  let position = source;
  // move until comes to rest or out of bounds.
  while (!outOfBounds(position, bounds)) {
    const newPosition = moveSand(position, rockLookup, sandLookup);
    // sand has come to rest.
    if (newPosition === position) {
      return newPosition;
    }
    position = newPosition;
  }
  return null;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const sandSource = new Vector2(500, 0);
  const rocks = parseLines(lines);
  const rockLookup = new Set(rocks.map((x) => x.toString()));
  const sandLookup = new Set();
  const bounds = findBounds([sandSource, ...rocks]);

  while (true) {
    const newSandPosition = produceSand(sandSource, rockLookup, sandLookup, bounds);
    if (!newSandPosition) {
      break;
    }
    sandLookup.add(newSandPosition.toString());
  }

  return sandLookup.size;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
