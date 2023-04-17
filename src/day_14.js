import { toNumber } from './util/string.js';
import { Vector2, add, down, downLeft, downRight, equals } from './util/vector2.js';

/**
 * Contains solutions for Day 14
 * Puzzle Description: https://adventofcode.com/2022/day/14
 */

/**
 * Print the cave to the console.
 */
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

/**
 * Is the position blocked by a rock or sand?
 */
const isBlocked = (position, rockLookup, sandLookup) => {
  const positionString = position.toString();
  return rockLookup.has(positionString) || sandLookup.has(positionString);
};

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
 * Move the sand until it comes to rest. If the sand cannot move the original position is returned.
 */
const tryToMoveSand = (() => {
  const movements = [down, downLeft, downRight];
  return (position, collisionFn) => {
    for (let index = 0; index < movements.length; index++) {
      const newPosition = add(position, movements[index]);
      if (!collisionFn(newPosition)) {
        return newPosition;
      }
    }
    return position;
  };
})();

/**
 * Continually produce sand grains from the source until the end condition is met.
 * Returns the number of sand grains produced.
 */
const simulate = (sandSource, rocks, collisionFn, simulateEndFn) => {
  const rockLookup = new Set(rocks.map((x) => x.toString()));
  const sandLookup = new Set();
  const collision = (position) => collisionFn(position, rockLookup, sandLookup);
  let previousSandPosition = sandSource;
  for (;;) {
    const newSandPosition = tryToMoveSand(previousSandPosition, collision);
    // end simulation if new position triggers end condition.
    if (simulateEndFn(newSandPosition, previousSandPosition)) {
      return sandLookup.size;
    }
    // if this grain comes to rest, store its position and produce another one.
    if (newSandPosition === previousSandPosition) {
      sandLookup.add(newSandPosition.toString());
      previousSandPosition = sandSource;
      continue;
    }
    // keep moving this grain of sand.
    previousSandPosition = newSandPosition;
  }
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Returns a function used to halt the simulation.
   * Tests to see whether a grain of sand has fallen into the abyss.
   */
  const outOfBoundsTest = (sandSource, rocks) => {
    const { bottom, top, left, right } = findBounds([sandSource, ...rocks]);
    return ({ x, y }) => y < bottom || y > top || x > right || x < left;
  };

  return ({ lines }) => {
    const sandSource = new Vector2(500, 0);
    const rocks = parseLines(lines);
    return simulate(sandSource, rocks, isBlocked, outOfBoundsTest(sandSource, rocks));
  };
})();

// end if hits the floor

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const endTest = (sandSource) => (position) => equals(position, sandSource);

  const collisionTest = (rocks) => {
    const floor = Math.max(...rocks.map(({ y }) => y)) + 2;
    return (position, rockLookup, sandLookup) => {
      if (position.y === floor) {
        return true;
      }
      return isBlocked(position, rockLookup, sandLookup);
    };
  };

  return ({ lines }) => {
    const sandSource = new Vector2(500, 0);
    const rocks = parseLines(lines);
    return simulate(sandSource, rocks, collisionTest(rocks), endTest(sandSource)) + 1;
  };
})();
