/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { loopingIterator, range } from './util/array.js';
import { isBitSet, leftShift, rightShift } from './util/bitwise.js';

/**
 * Render the world to the console.
 */
const print = (() => {
  const isFallingRock = (y, x, fallingRock) =>
    y <= fallingRock.y &&
    y > fallingRock.y - fallingRock.points.length &&
    isBitSet(fallingRock.points[fallingRock.y - y], x);

  const isRockAtRest = (y, x, world) => y < world.length && isBitSet(world[y], x);

  const rowToString = (y, world, fallingRock) => {
    let toReturn = '';
    for (let x = 6; x >= 0; x--) {
      if (isFallingRock(y, x, fallingRock)) {
        toReturn += '@';
      } else if (isRockAtRest(y, x, world)) {
        toReturn += '#';
      } else {
        toReturn += '.';
      }
    }
    return toReturn;
  };

  return (world, fallingRock) => {
    const maxY = Math.max(world.length, fallingRock.y);
    console.log();
    for (let y = maxY; y >= 0; y--) {
      console.log(`|${rowToString(y, world, fallingRock)}| - ${y}`);
    }
    console.log('+-------+');
  };
})();

/**
 * Defines each rock and the order they fall in.
 * A rock is defined as an collection of rows representing the y axis (ascending).
 * Each row is a bitfield which represents the x axis (ascending), rows are as wide as the room.
 * Every bit set to 1 represents a point occupied by the rock.
 * Every bit set to 0 represents empty space.
 * Rows start with points pre shifted right 2 units to allow for easier spawning.
 */
const rockTemplates = [
  // ####
  [0b0011110],
  // .#.
  // ###
  // .#.
  [0b0001000, 0b0011100, 0b0001000],
  // ..#
  // ..#
  // ###
  [0b0000100, 0b0000100, 0b0011100],
  // #
  // #
  // #
  // #
  [0b0010000, 0b0010000, 0b0010000, 0b0010000],
  // ##
  // ##
  [0b0011000, 0b0011000],
];

/**
 * The room is 7 units wide, when bit packing a horizontal slice of the room
 * the max possible zero based index is 6.
 */
const maxRoomIndex = 6;

/**
 * Parse the input and return an array of jet blast directions.
 * true for left and false for right.
 */
const parseInput = (input) => [...input].map((x) => x === '<');

/**
 * Spawns the rock template so its bottom edge is 3 units above the highest rock in the room.
 */
const spawnRock = (highestRockY, rockTemplate) => ({
  y: highestRockY + 3 + rockTemplate.length - 1,
  points: [...rockTemplate],
});

/**
 * Returns true if the point at the x position in the row is not empty space.
 */
const pointIsOccupied = (points, x) => isBitSet(points, maxRoomIndex - x);

/**
 * Returns true if the left most point in the row is touching the left wall of the room.
 */
const touchingLeftWall = (points) => pointIsOccupied(points, 0);

/**
 * Returns true if the right most point in the row is touching the right wall of the room.
 */
const touchingRightWall = (points) => pointIsOccupied(points, maxRoomIndex);

/**
 * Returns true if any points in the row collide.
 */
const rowsCollide = (lhs, rhs) => (lhs & rhs) !== 0;

/**
 * Returns true if any point in the rocks row collides with any stopped rock.
 */
const collidesWithStoppedRock = (rockRow, rockRowY, stoppedRocks) =>
  rockRowY < stoppedRocks.length && rowsCollide(rockRow, stoppedRocks[rockRowY]);

/**
 * Returns a new rock representing the original rock after a jet blast was applied.
 * If the movement would cause any part of the rock to move into the walls, floor, or a stopped rock the original rock is returned.
 */
const applyJetBlast = (isLeftBlast, rock, stoppedRocks) => {
  const isTouchingWall = isLeftBlast ? touchingLeftWall : touchingRightWall;
  const movePoints = isLeftBlast ? leftShift : rightShift;
  const newPoints = [];

  // apply the jet blast to each row of the rock.
  // if any movement of any row cannot happen due to a collision
  // then the original rock is returned.
  for (let rowIndex = 0; rowIndex < rock.points.length; rowIndex++) {
    const current = rock.points[rowIndex];

    // if the rock cannot be blasted because its already touching a wall
    // the nothing happens, return the original rock.
    if (isTouchingWall(current)) {
      return rock;
    }

    // blast the rock with the jet, shifting it to the left or the right.
    const moved = movePoints(current);

    // if the new position collides with any rock at rest
    // then nothing happens, return the original rock.
    if (collidesWithStoppedRock(moved, rock.y - rowIndex, stoppedRocks)) {
      return rock;
    }

    newPoints.push(moved);
  }

  return { ...rock, points: newPoints };
};

/**
 * Returns a new rock representing the original rock moved down one unit.
 * If the movement would cause any part of the rock to move into floor, or a stopped rock the original rock is returned.
 */
const moveRockDown = (rock, stoppedRocks) => {
  const newY = rock.y - 1;

  for (let y = newY; y > newY - rock.points.length; y--) {
    // if the downward movement causes the rock to clip the floor
    // then nothing happens, return original rock.
    if (y < 0) {
      return rock;
    }

    // if the new position collides with any rock at rest
    // then nothing happens, return the original rock.
    if (collidesWithStoppedRock(rock.points[newY - y], y, stoppedRocks)) {
      return rock;
    }
  }

  return { ...rock, y: newY };
};

/**
 * Returns a new rock representing the original rock after it has come to rest
 * from alternating between pushing the rock with jets and falling the rock one unit.
 */
const fallRockUntilLands = (rock, stoppedRocks, getNextJetBlast) => {
  let currentRock = rock;
  while (true) {
    const afterJetBlast = applyJetBlast(getNextJetBlast(), currentRock, stoppedRocks);
    const afterFall = moveRockDown(afterJetBlast, stoppedRocks);
    // if the rock came to rest, then return its final location.
    if (afterJetBlast === afterFall) {
      return afterFall;
    }
    currentRock = afterFall;
  }
};

/**
 * Returns a new array which contains the newly stopped rock merged into the existing stopped rocks array.
 */
const mergeRockIntoStoppedRocks = (rock, stoppedRocks) => {
  const toReturn = [...stoppedRocks];
  for (let index = rock.points.length - 1; index >= 0; index--) {
    const y = rock.y - index;
    const points = rock.points[index];
    if (y > stoppedRocks.length - 1) {
      // if the row exists outside of the "world" then push the row into the world.
      toReturn.push(points);
    } else {
      // otherwise merge the rock into the existing row.
      toReturn[y] |= points;
    }
  }
  return toReturn;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const getNextJetBlast = loopingIterator(parseInput(lines[0]));
  const getNextRockToSpawn = loopingIterator(rockTemplates);
  let stoppedRocks = [];
  let remainingRocks = 2022;

  while (remainingRocks--) {
    let rock = spawnRock(stoppedRocks.length, getNextRockToSpawn());
    rock = fallRockUntilLands(rock, stoppedRocks, getNextJetBlast);
    stoppedRocks = mergeRockIntoStoppedRocks(rock, stoppedRocks);
  }

  return stoppedRocks.length;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
