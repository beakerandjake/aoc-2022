/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { range } from './util/array.js';
import { Vector2, add, down, equals, left, right } from './util/vector2.js';

// todo smarter rocks, store and return left/right/top/bottom index and return the x/y values
// will speed up collision detection.

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

const chamberBounds = {
  left: 0,
  right: 6,
  bottom: 0,
};

/**
 * Parse the input and return the jet patterns.
 */
const parseInput = (input) => [...input].map((character) => (character === '>' ? 1 : -1));

/**
 * Returns a new rock with the movement applied.
 */
const moveRock = (rock, movement) => rock.map((position) => add(position, movement));

/**
 * Returns a new rock moved one unit to the left.
 */
const moveRockLeft = (rock) => moveRock(rock, left);

/**
 * Returns a new rock moved one unit to the right.
 */
const moveRockRight = (rock) => moveRock(rock, right);

/**
 * Returns a new rock moved one unit down.
 */
const moveRockDown = (rock) => moveRock(rock, down);

/**
 * Returns true if the position will collide with the right side of the chamber.
 */
const collidesWithRightWall = (position) => position.x > chamberBounds.right;

/**
 * Returns true if the position will collide with the left side of the chamber.
 */
const collidesWithLeftWall = (position) => position.x < chamberBounds.left;

/**
 * Returns true if the position will collide with the left or right wall.
 */
const collidesWithWalls = (position) =>
  collidesWithLeftWall(position) || collidesWithRightWall(position);

/**
 * Returns true if the position will collide with the floor.
 */
const collidesWithFloor = (position) => position.y < chamberBounds.bottom;

/**
 * Returns true if the position will collides with the rock.
 */
const collidesWithRock = (position, rock) =>
  rock.some((shapePosition) => equals(position, shapePosition));

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

const blowRock = (rock, direction) => {
  const newRock = moveRock(rock, direction);
  return newRock.some((position) => collidesWithWalls(position)) ? rock : newRock;
};

const blowRockRight = (rock) => blowRock(rock, right);

const blowRockLeft = (rock) => blowRock(rock, left);

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
  // const jetPatterns = parseInput(input);

  let rock = produceRock(0, shapeTemplates[3]);

  range(10).forEach(() => {
    rock = blowRockRight(rock);
    // print(0, 6, [rock]);
  });

  // print(0, 12, [rock]);
  // rock = moveRockRight(rock);
  // print(0, 12, [rock]);
  // rock = moveRockRight(rock);
  // print(0, 12, [rock]);
  // rock = moveRockRight(rock);
  // print(0, 12, [rock]);
  // rock = moveRockRight(rock);
  // print(0, 12, [rock]);

  // const highest = highestPointOnRocks(maps);
  // console.log(highest);

  // console.log(renderRow(0, [shapeTemplates[2].map((x) => add(x, new Vector2(0, 0)))]));
  // print(0, 10, [
  //   shapeTemplates[2],
  //   shapeTemplates[1].map((x) => add(x, new Vector2(1, 3))),
  // ]);
  // console.log();
  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
