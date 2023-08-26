/**
 * Contains solutions for Day 22
 * Puzzle Description: https://adventofcode.com/2022/day/22
 */
import { arrayToString } from './util/array.js';
import { convertTo2dArray, index2d, elementAt2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { Vector2, left, right, down, up, add } from './util/vector2.js';
import { toNumber } from './util/string.js';

const directions = [
  { value: right, display: '>' },
  { value: down, display: 'v' },
  { value: left, display: '<' },
  { value: up, display: '^' },
];

const directionIndexLookup = {
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
  history.forEach(({ position, facing }) => {
    mapCopy[index2d(shape.width, position.y, position.x)] = directions[facing].display;
  });
  console.log(array2dToString(mapCopy, shape));
};

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

/**
 * Parse the puzzle input and return the world map and monkey path.
 */
const parseInput = (lines) => {
  const { items, shape } = parseMap(lines.slice(0, -2));
  return {
    map: {
      data: items,
      shape,
    },
    path: parseNotes(lines[lines.length - 1]),
  };
};

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
 * Returns the new position after moving the specified amount.
 */
const move = (position, amount) => add(position, amount);

/**
 * Is the position outside of the map bounds?
 */
const outOfBounds = ({ x, y }, { shape: { width, height } }) =>
  x < 0 || x >= width || y < 0 || y >= height;

/**
 * Searches for the first non void tile and returns the position.
 * Search starts from (x,y) and increments each step by (xStep, yStep)
 */
const findFirstTile = (startX, startY, xStep, yStep, map) => {
  const position = new Vector2(startX, startY);
  console.log('starting search at', position);
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
 */
const wrapX = (y, facing, map) =>
  facing === directionIndexLookup.right
    ? findFirstTile(0, y, 1, 0, map)
    : findFirstTile(map.shape.width - 1, y, -1, 0, map);

/**
 * Wraps the y value around the column based on the facing direction.
 * If facing down assumes wrapping around the bottom edge.
 * If facing up assumes wrapping around the top edge.
 */
const wrapY = (x, facing, map) => {
  console.log('wrap around y');
  return facing === directionIndexLookup.up
    ? findFirstTile(x, map.shape.height - 1, 0, -1, map)
    : findFirstTile(x, 0, 0, 1, map);
};

const wrapAround = ({ x, y }, facing, map) =>
  facing === directionIndexLookup.left || facing === directionIndexLookup.right
    ? wrapX(y, facing, map)
    : wrapY(x, facing, map);

const tryToMove = (position, facing, map) => {
  const newPosition = move(position, directions[facing].value);

  if (outOfBounds(newPosition, map)) {
    return wrapAround(position, facing, map);
  }

  const destinationTile = getTile(map, newPosition);

  if (isVoid(destinationTile)) {
    console.log(`cant move to: ${newPosition} because void!!, facing: ${facing}`);
    return wrapAround(position, facing, map);
  }
  if (isWall(destinationTile)) {
    console.log(`cant move to: ${newPosition} because wall!`);
    return position;
  }
  console.log(`moving from: ${position} to ${newPosition}`);
  return newPosition;
};

const followInstruction = (position, facing, instruction, map) => {
  if (instruction === 'R') {
    return { position, facing: rotateClockwise(position, facing) };
  }
  if (instruction === 'L') {
    return { position, facing: rotateCounterClockwise(position, facing) };
  }
  return { position: tryToMove(position, facing, instruction, map), facing };
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input, lines }) => {
  console.log();

  const { map, path } = parseInput(lines);
  const startX = findStartX(map.data);
  let position = new Vector2(5, 7);
  let facing = 1;
  const history = [{ position, facing }];

  position = tryToMove(position, facing, map);
  history.push({ position, facing });
  // position = tryToMove(position, facing, map);
  // history.push({ position, facing });
  // position = tryToMove(position, facing, map);
  // history.push({ position, facing });
  // position = tryToMove(position, facing, map);
  // history.push({ position, facing });

  render(map, history);
  return 1234;
};
