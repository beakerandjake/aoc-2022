/**
 * Contains solutions for Day 22
 * Puzzle Description: https://adventofcode.com/2022/day/22
 */
import { arrayToString } from './util/array.js';
import { convertTo2dArray, index2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { Vector2, left, right, down, up, add } from './util/vector2.js';

const directions = [
  { value: right, display: '>' },
  { value: down, display: 'v' },
  { value: left, display: '<' },
  { value: up, display: '^' },
];

const render = (map, shape, history) => {
  const mapCopy = [...map];
  history.forEach(({ position, facing }) => {
    mapCopy[index2d(shape.width, position.y, position.x)] = directions[facing].display;
  });
  console.log(array2dToString(mapCopy, shape));
};

const findMaxWidth = (rows) => Math.max(...rows.map((row) => row.length));

const pad = (array, width, padItem) =>
  array.length >= width
    ? array
    : [...array, ...Array(width - array.length).fill(padItem)];

const parseMap = (lines) => {
  const maxWidth = findMaxWidth(lines);
  const padded = lines.map((line) => pad([...line], maxWidth, ' '));
  return convertTo2dArray(padded);
};

const parseInput = (lines) => {
  const { items, shape } = parseMap(lines.slice(0, -2));
  return {
    map: items,
    shape,
    path: lines[lines.length - 1],
  };
};

const findStartX = (map) =>
  // this works only because there is a guaranteed open tile in the first row.
  map.indexOf('.');

const move = (position, amount) => add(position, amount);

const rotateClockwise = (direction) => (direction + 1) % directions.length;

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input, lines }) => {
  const { map, shape, path } = parseInput(lines);
  const startX = findStartX(map);
  const position = new Vector2(startX, 0);
  const facing = 0;
  const history = [{ position, facing }];

  let newPosition = move(position, directions[facing].value);
  history.push({ position: newPosition, facing });
  newPosition = move(newPosition, directions[facing].value);
  let newFacing = rotateClockwise(facing);
  newFacing = rotateClockwise(newFacing);
  history.push({ position: newPosition, facing: newFacing });

  render(map, shape, history);
  // console.log(array2dToString(z.map, z.shape));
  return 1234;
  // your code here
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
