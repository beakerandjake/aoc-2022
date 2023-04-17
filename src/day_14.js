import { toNumber } from './util/string.js';
import { Vector2, equals, add, down, downLeft, downRight } from './util/vector2.js';

/**
 * Contains solutions for Day 14
 * Puzzle Description: https://adventofcode.com/2022/day/14
 */

/**
 * Parses a single line of input and returns the scan trace.
 */
const parseLine = (() => {
  const coordinateRegex = /(\d+),(\d+)/g;
  return (line) =>
    [...line.matchAll(coordinateRegex)].map(
      (match) => new Vector2(toNumber(match[1]), toNumber(match[2]))
    );
})();

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
 * Returns an array containing all rocks in the given path.
 */
const getAllRocksInPath = (() => {
  const trace = (path, idx) =>
    idx === 0
      ? [path[idx]]
      : [path[idx], ...expandPath(path[idx], path[idx - 1]), ...trace(path, idx - 1)];

  return (path) => trace(path, path.length - 1);
})();

const includes = (tile, tiles) => tiles.some((x) => equals(x, tile));

const print = (sandSource, rocks, sandAtRest, bounds) => {
  const render = (position) => {
    if (includes(position, rocks)) {
      return '#';
    }
    if (equals(position, sandSource)) {
      return '+';
    }
    if (includes(position, sandAtRest)) {
      return 'o';
    }
    return '.';
  };
  console.log();
  for (let y = bounds.bottom; y <= bounds.top; y++) {
    const line = [];
    for (let x = bounds.left; x <= bounds.right; x++) {
      line.push(render(new Vector2(x, y)));
    }
    console.log(line.join(''));
  }
};

const isBlocked = (position, rocks, sandAtRest) =>
  includes(position, rocks) || includes(position, sandAtRest);

const findBounds = (positions) => {
  const bounds = (values) => [Math.min(...values), Math.max(...values)];
  const [left, right] = bounds(positions.map(({ x }) => x));
  const [bottom, top] = bounds(positions.map(({ y }) => y));
  return { left, right, bottom, top };
};

const outOfBounds = (position, bounds) => {
  if (position.y < bounds.bottom || position.y > bounds.top) {
    return true;
  }
  if (position.x > bounds.right || position.x < bounds.left) {
    return true;
  }
  return false;
};

const moveSand = (position, rocks, sandAtRest) => {
  let desired = add(position, down);
  if (isBlocked(desired, rocks, sandAtRest)) {
    desired = add(position, downLeft);
  }
  if (isBlocked(desired, rocks, sandAtRest)) {
    desired = add(position, downRight);
  }
  return isBlocked(desired, rocks, sandAtRest) ? position : desired;
};

const produceSand = (source, rocks, sandAtRest, bounds) => {
  let position = source;
  // move until comes to rest or out of bounds.
  while (!outOfBounds(position, bounds)) {
    const newPosition = moveSand(position, rocks, sandAtRest);
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
  const rocks = lines.reduce(
    (acc, line) => [...acc, ...getAllRocksInPath(parseLine(line))],
    []
  );
  const sandAtRest = [];
  const bounds = findBounds([sandSource, ...rocks]);

  while (true) {
    const newSandPosition = produceSand(sandSource, rocks, sandAtRest, bounds);
    if (!newSandPosition) {
      break;
    }
    sandAtRest.push(newSandPosition);
  }
  
  return sandAtRest.length;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
