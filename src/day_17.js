/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { loopingIterator, range } from './util/array.js';
import { Vector2, add, equals, left, right } from './util/vector2.js';

// points, leftEdgeIndex, rightEdgeIndex

/**
 * Must redefine "down" for this world, the vector2 util defines (0,0) as top left.
 * This puzzle is easier if we define (0,0) as bottom left.
 */
const down = new Vector2(0, -1);

// todo smarter rocks, store and return left/right/top/bottom index and return the x/y values
// will speed up collision detection.
// parsing input, add functions instead, removes unnecessary checks.
// move is always the same, apply the movement fn then check for collision.
// attempt to move, return new position or false, gives faster check to see if stuck.

const rockTemplates = [
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
 * Returns true if the position intersect with any point of the rock.
 */
const positionIntersectsRock = (position, rock) =>
  rock.some((rockPosition) => equals(position, rockPosition));

/**
 * Returns true if the rock intersects with any rock at rest.
 */
const intersectsWithAnyRockAtRest = (rock, rocksAtRest) =>
  rock.some((position) =>
    rocksAtRest.some((rockAtRest) => positionIntersectsRock(position, rockAtRest))
  );

/**
 * Returns the highest y value the rock reaches.
 */
const highestPointOnRock = (rock) => Math.max(...rock.map(({ y }) => y));

/**
 * Returns the highest y value on the pile of rocks.
 */
const highestPointOnRocks = (rocks) => Math.max(...rocks.map(highestPointOnRock), 0);

/**
 * Spawns a new rock at the spawn point defined by the highest Y.
 */
const spawnRock = (highestY, rockTemplate) =>
  moveRock(rockTemplate, new Vector2(2, highestY + 3));

const print = (() => {
  const border = '+-------+';

  const positionIntersectsAnyRock = (position, rocks) =>
    rocks.some((rock) => positionIntersectsRock(position, rock));

  const renderRow = (y, fallingRock, rocksAtRest) => {
    let row = '';
    const position = new Vector2(0, y);
    while (position.x <= chamberBounds.right) {
      let toRender = '.';
      if (positionIntersectsRock(position, fallingRock)) {
        toRender = '@';
      } else if (positionIntersectsAnyRock(position, rocksAtRest)) {
        toRender = '#';
      }
      row += toRender;
      position.x += 1;
    }
    return `|${row}|`;
  };

  return (rowStart, rowEnd, fallingRock, rocksAtRest) => {
    console.log();
    console.log(`${border}`);
    range(rowEnd - rowStart, rowStart)
      .map((y) => renderRow(y, fallingRock, rocksAtRest))
      .reverse()
      .forEach((line, index, lines) =>
        console.log(`${line} - ${lines.length - index - 1 + rowStart}`)
      );
    console.log(`${border}`);
  };
})();

const jetCollisionFn = (rocks) => (rock) =>
  collidesWithWalls(rock) ||
  collidesWithFloor(rock) ||
  intersectsWithAnyRockAtRest(rock, rocks);

/**
 * Applies the movement function to the rock, then checks the collision function.
 * If the collision function returns false then the new position is returned.
 * If the collision function returns true, then false is returned, indicating the rock cannot move.
 */
const attemptToMoveRock = (rock, movementFn, collisionFn) => {
  const newRock = movementFn(rock);
  return !collisionFn(newRock) ? newRock : rock;
};

const fallRockUntilAtRest = (fallingRock, rocksAtRest, getNextJetBlastFn) => {
  let currentRock = fallingRock;
  const maxY = highestPointOnRocks(rocksAtRest) + 6;
  console.log('spawn');
  print(0, maxY, fallingRock, rocksAtRest);
  for (;;) {
    const afterJetBlast = attemptToMoveRock(
      currentRock,
      getNextJetBlastFn(),
      jetCollisionFn(rocksAtRest)
    );

    console.log('push');
    print(0, maxY, afterJetBlast, rocksAtRest);

    const afterDrop = attemptToMoveRock(
      afterJetBlast,
      moveRockDown,
      jetCollisionFn(rocksAtRest)
    );

    console.log('drop');
    print(0, maxY, afterDrop, rocksAtRest);

    if (afterJetBlast === afterDrop) {
      return afterDrop;
    }

    currentRock = afterDrop;
  }
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ input }) => {
  const getNextJetBlast = loopingIterator(parseInput(input));
  const getNextRock = loopingIterator(rockTemplates);
  const rocksAtRest = [];

  while (rocksAtRest.length < 3) {
    rocksAtRest.push(
      fallRockUntilAtRest(
        spawnRock(highestPointOnRocks(rocksAtRest), getNextRock()),
        rocksAtRest,
        getNextJetBlast
      )
    );
  }

  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
