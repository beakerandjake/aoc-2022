/**
 * Contains solutions for Day 22
 * Puzzle Description: https://adventofcode.com/2022/day/22
 */
import { convertTo2dArray, index2d, elementAt2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { Vector2, left, right, down, up, add, equals, one } from './util/vector2.js';
import { toNumber } from './util/string.js';
import { repeat } from './util/functions.js';

/**
 * The directions that you can face.
 * Order of items in array allows 90 degree rotation by incrementing or decrementing the index.
 */
const directions = [
  { value: right, display: '>' },
  { value: down, display: 'v' },
  { value: left, display: '<' },
  { value: up, display: '^' },
];

/**
 * Helper lookup which maps a direction name to its index in the direction array.
 */
const directionIndexes = {
  right: 0,
  down: 1,
  left: 2,
  up: 3,
};

/**
 * Print the map and move history to the console.
 */
const render = ({ data, shape }, history) => {
  const mapCopy = [...data];
  history.forEach(({ position, facing }, index) => {
    let char = directions[facing].display;
    if (index === 0) {
      char = '0';
    } else if (index === history.length - 1) {
      char = '$';
    }
    mapCopy[index2d(shape.width, position.y, position.x)] = char;
  });
  console.log(array2dToString(mapCopy, shape));
};

/**
 * Parse the puzzle input and return the world map and monkey path.
 */
const parseInput = (() => {
  /**
   * Finds the item in the array with the max length.
   */
  const findMaxWidth = (rows) => Math.max(...rows.map((row) => row.length));

  /**
   * Returns a new array that is padded to the target width with the pad item.
   * Arrays which are longer than or equal to the target width are not modified.
   */
  const pad = (array, width, padItem) =>
    array.length >= width
      ? array
      : [...array, ...Array(width - array.length).fill(padItem)];

  /**
   * Returns a 2d array representing the map.
   */
  const parseMap = (lines) => {
    const maxWidth = findMaxWidth(lines);
    const padded = lines.map((line) => pad([...line], maxWidth, ' '));
    return convertTo2dArray(padded);
  };

  /**
   * Parse the monkeys notes and returns the path to take.
   */
  const parseNotes = (line) =>
    line
      .match(/\d+|\w/g)
      .map((match) => (match === 'L' || match === 'R' ? match : toNumber(match)));

  return (lines) => {
    const { items, shape } = parseMap(lines.slice(0, -2));
    return {
      map: {
        data: items,
        shape,
      },
      path: parseNotes(lines[lines.length - 1]),
    };
  };
})();

/**
 * Returns the index of the starting tile.
 */
const findStartX = (map) =>
  // this works only because there is a guaranteed open tile in the first row.
  map.indexOf('.');

/**
 * Returns a new direction that is 90 degrees clockwise from the current direction.
 */
const rotateClockwise = (facing) => (facing + 1) % directions.length;

/**
 * Returns a new direction that is 90 degrees counter clockwise from the current direction.
 */
const rotateCounterClockwise = (facing) =>
  (((facing - 1) % directions.length) + directions.length) % directions.length;

/**
 * Is the tile an impassible wall?
 */
const isWall = (tile) => tile === '#';

/**
 * Is the tile an empty void?
 */
const isVoid = (tile) => tile === ' ';

/**
 * Returns the tile at the given position.
 */
const getTile = (map, { x, y }) => elementAt2d(map.data, map.shape, y, x);

/**
 * Is the position outside of the map bounds?
 */
const outOfBounds = ({ x, y }, { shape: { width, height } }) =>
  x < 0 || x >= width || y < 0 || y >= height;

/**
 * Attempts to move one tile in the currently facing direction.
 * If the new position is obstructed by a wall the old position is returned.
 */
const move = (position, facing, map, wrapAroundFn) => {
  let newPosition = add(position, directions[facing].value);
  let destinationTile = getTile(map, newPosition);
  if (outOfBounds(newPosition, map) || isVoid(destinationTile)) {
    newPosition = wrapAroundFn(newPosition, facing, map);
    destinationTile = getTile(map, newPosition);
  }
  return !isWall(destinationTile) ? newPosition : position;
};

/**
 * Attempts to move one tile in the currently facing direction up to x times.
 * If a new position is obstructed by a wall the old position is returned.
 * Can optionally pass a callback fn to get the current position on each successful move.
 */
const moveTimes = (position, facing, times, map, wrapAroundFn, onMoveCallback) => {
  let currentPosition = position;
  // eslint-disable-next-line consistent-return
  repeat(() => {
    const newPosition = move(currentPosition, facing, map, wrapAroundFn);
    if (equals(newPosition, currentPosition)) {
      return false;
    }
    currentPosition = newPosition;
    if (onMoveCallback) {
      onMoveCallback(currentPosition);
    }
  }, times);
  return currentPosition;
};

const followPathWithHistory = (position, facing, path, map, wrapAroundFn) => {
  let curr = {
    facing,
    position,
  };
  return path.reduce((acc, value) => {
    if (value === 'R') {
      curr = { ...curr, facing: rotateClockwise(curr.facing) };
      acc.push(curr);
      return acc;
    }
    if (value === 'L') {
      curr = { ...curr, facing: rotateCounterClockwise(curr.facing) };
      acc.push(curr);
      return acc;
    }
    const n = moveTimes(curr.position, curr.facing, value, map, wrapAroundFn, (x) => {
      acc.push({ ...curr, position: x });
    });
    curr = { ...curr, position: n };
    return acc;
  }, []);
};

/**
 * Follow the each instruction in the path and return the resulting postiion and facing
 */
const followPath = (position, facing, path, map, wrapAroundFn) =>
  path.reduce(
    (acc, value) => {
      if (value === 'R') {
        return { ...acc, facing: rotateClockwise(acc.facing) };
      }
      if (value === 'L') {
        return { ...acc, facing: rotateCounterClockwise(acc.facing) };
      }
      return {
        ...acc,
        position: moveTimes(acc.position, acc.facing, value, map, wrapAroundFn),
      };
    },
    { position, facing }
  );

/**
 * Calculates the final password based on the position and facing.
 */
const finalPassword = (position, facing) => {
  const { x, y } = add(position, one);
  return 1000 * y + 4 * x + facing;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Searches for the first non void tile and returns the position.
   * Search starts from (x,y) and increments each step by (xStep, yStep)
   */
  const findFirstTile = (startX, startY, xStep, yStep, map) => {
    const position = new Vector2(startX, startY);
    for (;;) {
      if (isVoid(getTile(map, position))) {
        position.x += xStep;
        position.y += yStep;
        continue;
      }
      return position;
    }
  };

  /**
   * Wraps the x value around the row based on the facing direction.
   * If facing right assumes wrapping around the right edge.
   * If facing left assumes wrapping around the left edge.
   * Returns first non void tile from the wrapped side.
   */
  const wrapX = (y, facing, map) =>
    facing === directionIndexes.right
      ? findFirstTile(0, y, 1, 0, map)
      : findFirstTile(map.shape.width - 1, y, -1, 0, map);

  /**
   * Wraps the y value around the column based on the facing direction.
   * If facing down assumes wrapping around the bottom edge.
   * If facing up assumes wrapping around the top edge.
   * Returns first non void tile from the wrapped side.
   */
  const wrapY = (x, facing, map) =>
    facing === directionIndexes.up
      ? findFirstTile(x, map.shape.height - 1, 0, -1, map)
      : findFirstTile(x, 0, 0, 1, map);

  /**
   * Wraps the position around the edge of the map based on the current facing direction.
   * Returns first non void tile from the wrapped side.
   */
  const wrapAround = ({ x, y }, facing, map) =>
    facing === directionIndexes.left || facing === directionIndexes.right
      ? wrapX(y, facing, map)
      : wrapY(x, facing, map);

  return ({ lines }) => {
    const { map, path } = parseInput(lines);
    const { position, facing } = followPath(
      new Vector2(findStartX(map.data), 0),
      directionIndexes.right,
      path,
      map,
      wrapAround
    );
    return finalPassword(position, facing);

    // const { map, path } = parseInput(lines);
    // const history = followPathWithHistory(
    //   new Vector2(findStartX(map.data), 0),
    //   directionIndexLookup.right,
    //   path,
    //   map,
    //   wrapAround
    // );
    // const { position, facing } = history[history.length - 1];
    // return finalPassword(position, facing);
  };
})();
