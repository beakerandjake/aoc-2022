/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { range } from './util/array.js';
import { Vector2, add, equals, left, right } from './util/vector2.js';

/**
 * Must redefine "down" for this world, the vector2 util defines (0,0) as top left.
 * This puzzle is easier if we define (0,0) as bottom left.
 */
const down = new Vector2(0, -1);

// todo smarter rocks, store and return left/right/top/bottom index and return the x/y values
// will speed up collision detection.
// circular linked list for jet patterns.
// removes need to track index. must still know current node..
// parsing input, add functions instead, removes unnecessary checks.
// move is always the same, apply the movement fn then check for collision.

const shapeTemplates = [
  // ####
  [new Vector2(0, 0), new Vector2(1, 0), new Vector2(2, 0), new Vector2(3, 0)],
  // .#.
  // ###
  // .#.
  [
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(1, 1),
    new Vector2(2, 1),
    new Vector2(1, 2),
  ],
  // ..#
  // ..#
  // ###
  [
    new Vector2(2, 2),
    new Vector2(2, 1),
    new Vector2(0, 0),
    new Vector2(1, 0),
    new Vector2(2, 0),
  ],
  // #
  // #
  // #
  // #
  [new Vector2(0, 0), new Vector2(0, 1), new Vector2(0, 2), new Vector2(0, 3)],
];

/**
 * The extreme x and y scalar values of the chamber.
 */
const chamberBounds = {
  left: 0,
  right: 6,
  bottom: 0,
};

/**
 * Returns a new rock with the movement applied.
 */
const moveRock = (rock, movement) => rock.map((position) => add(position, movement));

/**
 * Returns a new rock moved one unit to the right.
 */
const moveRockRight = (rock) => moveRock(rock, right);

/**
 * Returns a new rock moved one unit to the left.
 */
const moveRockLeft = (rock) => moveRock(rock, left);

/**
 * Returns a new rock moved one unit down.
 */
const moveRockDown = (rock) => moveRock(rock, down);

/**
 * Parse the input and return the jet movement functions.
 */
const parseInput = (input) =>
  [...input].map((character) => (character === '>' ? moveRockRight : moveRockLeft));

/**
 * Returns true if the position will collide with the right side of the chamber.
 */
const collidesWithRightWall = ({ x }) => x > chamberBounds.right;

/**
 * Returns true if the position will collide with the left side of the chamber.
 */
const collidesWithLeftWall = ({ x }) => x < chamberBounds.left;

/**
 * Returns true if any point of the rock will collide with a left or right wall.
 */
const collidesWithWalls = (rock) =>
  rock.some(
    (position) => collidesWithLeftWall(position) || collidesWithRightWall(position)
  );

/**
 * Returns true if any point of the rock will collide with the floor.
 */
const collidesWithFloor = (rock) => rock.some(({ y }) => y < chamberBounds.bottom);

/**
 * Returns true if any point of the rock will collide with the position.
 */
const collidesWithRock = (position, rock) =>
  rock.some((rockPosition) => equals(position, rockPosition));

/**
 * Returns true if the position will collide with any of the shapes.
 */
const collidesWithAnyRock = (position, rocks) =>
  rocks.some((rock) => collidesWithRock(position, rock));

/**
 * Returns the highest y value the rock reaches.
 */
const highestPointOnRock = (rock) => Math.max(...rock.map(({ y }) => y));

/**
 * Returns the highest y value on the pile of rocks.
 */
const highestPointOnRocks = (rocks) => Math.max(...rocks.map(highestPointOnRock));

/**
 * Produces a new rock at the spawn point defined by the highest Y.
 */
const produceRock = (highestY, rockTemplate) =>
  moveRock(rockTemplate, new Vector2(2, highestY + 3));

/**
 * Attempts to blow the rock in the direction and return the new position, if the rock cannot be moved the old rock is returned.
 */
const blowRock = (rock, direction, rocks) => {
  const newRock = moveRock(rock, direction);
  return collidesWithWalls(newRock) ||
    collidesWithFloor(newRock) || // floor check needed for l/r movement?
    collidesWithAnyRock(newRock, rocks)
    ? rock
    : newRock;
};

const rockFallDown = (rock, rocks) => {
  const newRock = moveRock(rock, down);
  return collidesWithAnyRock(newRock, rocks) || collidesWithFloor(newRock)
    ? rock
    : newRock;
};

/**
 * Attempts to blow the rock right and returns the new rock position.
 */
const blowRockRight = (rock, rocks) => blowRock(rock, right, rocks);

/**
 * Attempts to blow the rock left and returns the new rock position.
 */
const blowRockLeft = (rock, rocks) => blowRock(rock, left, rocks);

const getJetFn = (jetPatterns, index) =>
  jetPatterns[index] === 1 ? blowRockRight : blowRockLeft;

const print = (() => {
  const border = '+-------+';

  const renderRow = (y, shapes) => {
    let row = '';
    for (let x = 0; x < 7; x++) {
      row += collidesWithAnyRock(new Vector2(x, y), shapes) ? '#' : '.';
    }
    return `|${row}|`;
  };

  return (rowStart, rowEnd, shapes) => {
    console.log();
    console.log(`${border}`);
    range(rowEnd - rowStart, rowStart)
      .map((y) => renderRow(y, shapes))
      .reverse()
      .forEach((line, index, lines) =>
        console.log(`${line} - ${lines.length - index - 1 + rowStart}`)
      );
    console.log(`${border}`);
  };
})();

const moveTest = (rock, rocks, jetPatterns, jetPatternIndex) => {
  let newRock = getJetFn(jetPatterns, jetPatternIndex)(rock, rocks);
  newRock = rockFallDown(newRock, rocks);
  return newRock;
};

const maps = [
  shapeTemplates[0],
  moveRock(shapeTemplates[1], new Vector2(1, 1)),
  moveRock(shapeTemplates[2], new Vector2(2, 4)),
  moveRock(shapeTemplates[3], new Vector2(2, 5)),
];

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input }) => {
  const jetPatterns = parseInput(input);
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
