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
const dropRocks = (input, stopConditionFn) => {
  const getNextJet = loopingIterator(parseInput(input));
  const getNextRockToSpawn = loopingIterator(rockTemplates);
  const stoppedRocks = [];
  for (;;) {
    const newRock = moveRockUntilStops(
      spawnRock(stoppedRocks.length, getNextRockToSpawn()),
      stoppedRocks,
      getNextJet
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
  return dropRocks(lines[0], () => ++dropCount === 5404).length;
};

/**
 * Checks to see if the stopped rocks have formed a pattern.
 * If a pattern is found a new array is returned containing the pattern.
 * Otherwise an empty array is returned.
 */
const extractLoop = (stoppedRocks) => {
  if (stoppedRocks.length % 2 !== 0) {
    return [];
  }
  const halfway = stoppedRocks.length / 2;
  for (let index = 0; index < halfway; index++) {
    if (stoppedRocks[index] !== stoppedRocks[halfway + index]) {
      return [];
    }
  }
  return stoppedRocks.slice(halfway);
};

const testCycle = (items, startIndex) => {
  if (startIndex <= 1) {
    return [];
  }

  for (let current = startIndex - 1; current >= 0; current--) {
    if (items[current] === items[startIndex]) {
      const length = startIndex - current;
      if (current - length + 1 < 0) {
        return [];
      }
      for (let j = 0; j < length; j++) {
        if (items[current - j] !== items[startIndex - j]) {
          return [];
        }
      }
      return items.slice(current, startIndex);
    }
  }
  return [];
};

const slicesEqual = (items, sliceLength, rhsStartIndex, lhsStartIndex) => {
  for (let index = 0; index < sliceLength; index++) {
    if (items[rhsStartIndex + index] !== items[lhsStartIndex + index]) {
      return false;
    }
  }
  return true;
};

const cycleRepeats = (items, startIndex, length) => {
  // bail if cycle length is larger than than remaining items in array.
  if (items.length - (startIndex + length) < length) {
    return false;
  }

  // ensure each item in the cycle repeats until the end of the array.
  // allows incomplete cycles at the tail of the array.
  for (let i = 0; i < length; i++) {
    let skipIndex = startIndex + i + length;
    while (skipIndex < items.length) {
      if (items[i + startIndex] !== items[skipIndex]) {
        return false;
      }
      skipIndex += length;
    }
  }
  return true;
};

/**
 * Searches from the top of the stopped rocks down and looks for a repeating cycle of rocks.
 * If a cycle is found, returns a new array containing the cycle.
 * If no cycle is found an empty array is returned.
 */
const findCycle = (items) => {
  const { length } = items;
  for (let i = 0; i < length; i++) {
    // console.group(`testing items[${i}] = ${items[i]}:`);
    for (let j = i + 1; j < length; j++) {
      // console.log(`items[${j}]`);
      if (items[i] !== items[j]) {
        continue;
      }
      if (cycleRepeats(items, i, j - i) && j - i > 1) {
        const cycle = items.slice(i, j);
        if (cycle.length === 1 || cycle.every((x) => cycle[0] === x)) {
          continue;
        }
        // console.groupEnd();
        return { startIndex: i, items: items.slice(i, j) };
      }
    }
    // console.groupEnd();
  }

  return null;
};

// const items = [5, 8, ...range(100000), ...range(100000), 0, 1];
const randItems = range(6).map(() => randomInt(50));

const randomArray = (count) => range(count).map(() => randomInt(50));

const itemz = [0, 1, 2, 5, 7, 9, 15, 2];
// const itemz = [...randomArray(5), ...randItems, ...randItems, ...randItems.slice(0, 2)];

const testABunch = () => {
  // console.log();

  let testCount = 0;

  for (let i = 0; i < 7; i++) {
    testCount++;
    const cycle = randomArray(2500);
    const junk = randomArray(158).map((x) => -(x + 1));
    const items = [
      ...junk,
      ...cycle,
      ...cycle,
      ...cycle.slice(0, randomInt(cycle.length)),
    ];
    const foundCycle = findCycle(items);

    if (foundCycle === null) {
      console.log('got a null cycle');
      break;
    }

    if (foundCycle.startIndex !== junk.length) {
      console.log(
        `cycle start index was: ${foundCycle.startIndex}, but junk length was: ${junk.length}`
      );
      console.log(`start: ${items[junk.length - 1]} end: ${items[items.length - 1]}`);
      break;
    }

    if (foundCycle.items.length !== cycle.length) {
      console.log('cycle length not right');
      break;
    }
  }

  // console.log(testCount);
};

const testOne = () => {
  const items = [0, 1, 2, 5, 7, 9, 15, 2, 2];

  console.log();
  console.log('items', arrayToString(items));
  console.log(
    'index',
    arrayToString(items, (_, idx) => idx)
  );
  const cycle = findCycle(items);
  // console.log('repeats', cycleRepeats(items, 2, 3));
  console.log(
    `got a cycle, start index: ${cycle?.startIndex}, length: ${cycle?.items.length}`
  );
};

const testReal = (lines) => {
  let dropCount = 0;
  let cycle = null;
  const stoppedRocks = dropRocks(lines[0], (currentRocks) => {
    if (++dropCount % 10000 === 0) {
      cycle = findCycle(currentRocks);
    }
    return cycle !== null;
  });

  // if (cycle) {
  //   console.log(
  //     'got a cycle!',
  //     cycle.startIndex,
  //     'items',
  //     cycle.items.length,
  //     'total length',
  //     stoppedRocks.length
  //   );
  // }
};
/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = async ({ lines }) => {
  // testABunch();
  testOne();
  // testReal(lines);

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
