import { toNumber } from './util/string.js';
import { Vector2 } from './util/vector2.js';

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

const print = (sandSource, rocks, rocksLookup) => {
  const bounds = (values) => [Math.min(...values), Math.max(...values)];
  const render = (position) => {
    if (rocksLookup.has(position.toString())) {
      return '#';
    }

    if (position.toString() === sandSource.toString()) {
      return '+';
    }

    return '.';
  };
  const allPoints = [sandSource, ...rocks];
  const [minX, maxX] = bounds(allPoints.map(({ x }) => x));
  const [minY, maxY] = bounds(allPoints.map(({ y }) => y));

  console.log('minX', minX, 'maxY', maxY);
  console.log('minY', minY, 'maxY', maxY);

  for (let y = minY; y <= maxY; y++) {
    const line = [];
    for (let x = minX; x <= maxX; x++) {
      line.push(render(new Vector2(x, y)));
    }
    console.log(line.join(''));
  }
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  console.log();
  const sandSource = new Vector2(500, 0);
  const rocks = lines.reduce(
    (acc, line) => [...acc, ...getAllRocksInPath(parseLine(line))],
    []
  );
  const rocksLookup = new Set(rocks.map((rock) => rock.toString()));
  print(sandSource, rocks, rocksLookup);
  // console.log(rocks);

  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
