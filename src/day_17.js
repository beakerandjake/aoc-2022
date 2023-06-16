/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { conditionalMap, loopingIterator } from './util/array.js';

/**
 * Defines each rock and the order they fall in.
 * A rock is defined as an collection of rows representing the y axis (ascending).
 * Each row represents points on the x axis, stored as a  bitfield rows are as wide as the room.
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
 * Attempts to push all points on the row one unit to the left.
 * If a point is already touching the left wall then the original points are returned.
 */
const pushLeft = (row) => ((row & 0b1000000) === 0 ? row << 1 : row);

/**
 * Attempts to push all points on the row one unit to the right.
 * If a point is already touching the right wall then the original points are returned.
 */
const pushRight = (row) => ((row & 0b0000001) === 0 ? row >> 1 : row);

/**
 * Parse the input and return an array of jet blast push functions.
 */
const parseInput = (input) => [...input].map((x) => (x === '<' ? pushLeft : pushRight));

/**
 * Spawns a new instance of the rock template.
 * The new rocks bottom edge will be 3 units above the highest rock in the room.
 */
const spawnRock = (highestRockY, rockTemplate) => ({
  y: highestRockY + 3 + rockTemplate.length - 1,
  rows: [...rockTemplate],
});

/**
 * Returns true if any points in the rows collide.
 */
const rowsCollide = (lhs, rhs = 0) => (lhs & rhs) !== 0;

/**
 * Returns a new rock representing the original rock after a jet blast was applied.
 * If the movement would cause any part of the rock to move into the walls, floor, or a stopped rock the original rock is returned.
 */
const applyJetBlast = (rock, stoppedRocks, jetBlastFn) => {
  const newPoints = conditionalMap(rock.rows, (row, index) => {
    const pushed = jetBlastFn(row);
    return rowsCollide(pushed, stoppedRocks[rock.y - index]) ? row : pushed;
  });
  return newPoints === rock.rows ? rock : { ...rock, rows: newPoints };
};

/**
 * Returns a new rock representing the original rock moved down one unit.
 * If the movement would cause any part of the rock to move into floor, or a stopped rock the original rock is returned.
 */
const moveRockDown = (rock, stoppedRocks) => {
  const newY = rock.y - 1;

  for (let y = newY; y > newY - rock.rows.length; y--) {
    // if the downward movement causes the rock to clip the floor
    // then nothing happens, return original rock.
    if (y < 0) {
      return rock;
    }

    // if the new position collides with any rock at rest
    // then nothing happens, return the original rock.
    if (rowsCollide(rock.rows[newY - y], stoppedRocks[y])) {
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
    const afterJetBlast = applyJetBlast(currentRock, stoppedRocks, getNextJetBlast());
    const afterFall = moveRockDown(afterJetBlast, stoppedRocks);
    // if the rock came to rest, then return its final location.
    if (afterJetBlast === afterFall) {
      return afterFall;
    }
    currentRock = afterFall;
  }
};

/**
 * Merge the newly stopped rock merged into the existing stopped rocks array.
 * This method mutates the stopped rocks array.
 */
const mergeRockIntoStoppedRocks = (rock, stoppedRocks) => {
  for (let index = rock.rows.length - 1; index >= 0; index--) {
    const y = rock.y - index;
    const points = rock.rows[index];
    if (y > stoppedRocks.length - 1) {
      stoppedRocks.push(points);
    } else {
      // eslint-disable-next-line no-param-reassign
      stoppedRocks[y] |= points;
    }
  }
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const getNextJetBlast = loopingIterator(parseInput(lines[0]));
  const getNextRockToSpawn = loopingIterator(rockTemplates);
  const stoppedRocks = [];
  let remainingRocks = 2022;

  while (remainingRocks--) {
    const newRock = fallRockUntilLands(
      spawnRock(stoppedRocks.length, getNextRockToSpawn()),
      stoppedRocks,
      getNextJetBlast
    );
    mergeRockIntoStoppedRocks(newRock, stoppedRocks);
  }

  return stoppedRocks.length;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
