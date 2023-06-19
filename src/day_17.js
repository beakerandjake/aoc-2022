/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { writeFile } from 'node:fs/promises';
import {
  conditionalMap,
  loopingIterator,
  forEachReverse,
  range,
  arrayToString,
  arraysEqual,
} from './util/array.js';
import { isBitSet } from './util/bitwise.js';
import { randomInt } from './util/math.js';

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
 * Returns a new rock representing the original rock after a jet of hot gas pushes the rock one unit.
 * If the movement would cause any part of the rock to move into the walls, floor, or a stopped rock the original rock is returned.
 */
const pushRock = (rock, stoppedRocks, jetFn) => {
  const newPoints = conditionalMap(rock.rows, (row, index) => {
    const pushed = jetFn(row);
    return rowsCollide(pushed, stoppedRocks[rock.y - index]) ? row : pushed;
  });
  return newPoints !== rock.rows ? { ...rock, rows: newPoints } : rock;
};

/**
 * Returns a new rock representing the original rock moved down one unit.
 * If the movement would cause any part of the rock to move into floor, or a stopped rock the original rock is returned.
 */
const dropRock = (rock, stoppedRocks) => {
  const newY = rock.y - 1;
  const canDrop = rock.rows.every((row, index) => {
    const rowY = newY - index;
    return rowY >= 0 && !rowsCollide(row, stoppedRocks[rowY]);
  });
  return canDrop ? { ...rock, y: newY } : rock;
};

/**
 * Returns a new rock representing the original rock after it has come to rest
 * from alternating between pushing the rock with jets and falling the rock one unit.
 */
const moveRockUntilStops = (rock, stoppedRocks, getNextJetBlast) => {
  let previous = null;
  let current = rock;
  while (current !== previous) {
    previous = pushRock(current, stoppedRocks, getNextJetBlast());
    current = dropRock(previous, stoppedRocks);
  }
  return current;
};

/**
 * Merge the newly stopped rock merged into the existing stopped rocks array.
 * This method mutates the stopped rocks array.
 */
const mergeRockIntoStoppedRocks = (rock, stoppedRocks) => {
  forEachReverse(rock.rows, (row, index) => {
    const rowY = rock.y - index;
    if (rowY >= stoppedRocks.length) {
      stoppedRocks.push(row);
    } else {
      // eslint-disable-next-line no-param-reassign
      stoppedRocks[rowY] |= row;
    }
  });
};

/**
 * Drop rocks until the stop condition is met.
 * Returns an array representing the state of the room.
 */
const dropRocks = (getNextJetFn, getNextRockFn, stopConditionFn) => {
  const stoppedRocks = [];
  for (;;) {
    const newRock = moveRockUntilStops(
      spawnRock(stoppedRocks.length, getNextRockFn()),
      stoppedRocks,
      getNextJetFn
    );
    mergeRockIntoStoppedRocks(newRock, stoppedRocks);

    if (stopConditionFn(stoppedRocks)) {
      return stoppedRocks;
    }
  }
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  let dropCount = 0;
  return dropRocks(
    loopingIterator(parseInput(lines[0])),
    loopingIterator(rockTemplates),
    () => ++dropCount === 2022
  ).length;
};

/**
 * Checks to see if the given elements from items[i -> i + cycleLength]
 * Continually repeat until the end of the array.
 */
const cycleRepeats = (items, startIndex, cycleLength) => {
  // bail if cycle length is larger than than remaining items in array.
  if (items.length - (startIndex + cycleLength) < cycleLength) {
    return false;
  }

  // ensure each item in the cycle repeats until the end of the array.
  // allows incomplete cycles at the tail of the array.
  for (let i = 0; i < cycleLength; i++) {
    let skipIndex = startIndex + i + cycleLength;
    while (skipIndex < items.length) {
      if (items[i + startIndex] !== items[skipIndex]) {
        return false;
      }
      skipIndex += cycleLength;
    }
  }
  return true;
};

/**
 * Search the stopped rocks and detect if a repeating cycle of rocks has formed.
 * If no cycle is found, null is returned.
 */
const findCycle = (items) => {
  for (let i = 0; i < items.length; i++) {
    // only search while potential cycle length is smaller than remaining elements.
    const searchEnd = Math.floor((items.length - i) / 2) + i;
    for (let j = i + 1; j < searchEnd; j++) {
      if (items[i] === items[j] && cycleRepeats(items, i, j - i)) {
        return { startIndex: i, items: items.slice(i, j) };
      }
    }
  }
  return null;
};

const simulateUntilCycleFound = (jetBlastIterator, rockTemplateIterator) => {};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = async ({ lines }) => {
  // need to get index of jet blast and rock when simulation stops.

  let dropCount = 0;
  let cycle = null;
  const stoppedRocks = dropRocks(lines[0], (currentRocks) => {
    if (++dropCount % 1000 === 0) {
      cycle = findCycle(currentRocks);
    }
    return cycle !== null;
  });

  // // console.log('got some zeros', stoppedRocks.filter((x) => x > 127).length);
  // await writeFile(
  //   './test.txt',
  //   stoppedRocks
  //     .reverse()
  //     .map((x) => {
  //       const bits = [];
  //       for (let index = 0; index <= 6; index++) {
  //         bits.push(isBitSet(x, index) ? '#' : '.');
  //       }
  //       return bits.reverse().join('');
  //     })
  //     .join('\n')
  // );

  return 1234;
};
