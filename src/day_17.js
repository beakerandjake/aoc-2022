/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { loopingIterator, range } from './util/array.js';
import { Vector2, add, equals, left, right } from './util/vector2.js';

/**
 * Must redefine "down" for this world, the vector2 util defines (0,0) as top left.
 * This puzzle is easier if we define (0,0) as bottom left.
 */
const down = new Vector2(0, -1);

/**
 * Defines the shape of each rock that falls and the order they fall in.
 */
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
  // ##
  // ##
  [new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1), new Vector2(1, 1)],
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
 * Spawns a new rock at the spawn point defined by the highest Y.
 */
const spawnRock = (highestY, rockTemplate) =>
  moveRock(rockTemplate, new Vector2(2, highestY + 4));

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

/**
 * Returns a function that can be used to detect if the rock collides
 * with the walls, floor or other rocks.
 */
const getRockCollisionFunction = (rocks) => (rock) =>
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

  for (;;) {
    const collisionFn = getRockCollisionFunction(rocksAtRest);

    const afterJetBlast = attemptToMoveRock(
      currentRock,
      getNextJetBlastFn(),
      collisionFn
    );

    const afterDrop = attemptToMoveRock(afterJetBlast, moveRockDown, collisionFn);

    if (afterJetBlast === afterDrop) {
      return afterDrop;
    }

    currentRock = afterDrop;
  }
};

/**
 * Performance improvements:
 * Rocks know top index, speeds up highest check.
 * Put settled rock positions into set instead of into array.
 * Batch settled rocks into array of sets, check "higher" sets first as a higher collision is more likely.
 */

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const getNextJetBlast = loopingIterator(parseInput(lines[0]));
  const getNextRock = loopingIterator(rockTemplates);
  const rocksAtRest = [
    fallRockUntilAtRest(spawnRock(-1, getNextRock()), [], getNextJetBlast),
  ];
  let highestY = 0;

  while (rocksAtRest.length < 2022) {
    const newRock = fallRockUntilAtRest(
      spawnRock(highestY, getNextRock()),
      rocksAtRest,
      getNextJetBlast
    );
    highestY = Math.max(highestY, ...newRock.map(({ y }) => y));
    rocksAtRest.push(newRock);
  }

  return highestY + 1;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
