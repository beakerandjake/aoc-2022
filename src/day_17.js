/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */
import { conditionalMap, forEachReverse, loopingIterator } from './util/array.js';

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
const pushRock = (rock, world, jetFn) => {
  const newRows = conditionalMap(rock.rows, (row, index) => {
    const pushed = jetFn(row);
    return rowsCollide(pushed, world[rock.y - index]) ? row : pushed;
  });
  return newRows !== rock.rows ? { ...rock, rows: newRows } : rock;
};

/**
 * Returns a new rock representing the original rock moved down one unit.
 * If the movement would cause any part of the rock to move into floor, or a stopped rock the original rock is returned.
 */
const dropRock = (rock, world) => {
  const newY = rock.y - 1;
  const canDrop = rock.rows.every((row, index) => {
    const rowY = newY - index;
    return rowY >= 0 && !rowsCollide(row, world[rowY]);
  });
  return canDrop ? { ...rock, y: newY } : rock;
};

/**
 * Returns a new rock representing the original rock after it has come to rest
 * from alternating between pushing the rock with jets and falling the rock one unit.
 */
const moveRockUntilStops = (rock, world, getNextJetBlast) => {
  let previous = null;
  let current = rock;
  while (current !== previous) {
    previous = pushRock(current, world, getNextJetBlast());
    current = dropRock(previous, world);
  }
  return current;
};

/**
 * Merge the newly stopped rock merged into the existing stopped rocks array.
 * This method mutates the stopped rocks array.
 */
const mergeRockIntoWorld = (rock, world) => {
  forEachReverse(rock.rows, (row, index) => {
    const rowY = rock.y - index;
    if (rowY >= world.length) {
      world.push(row);
    } else {
      // eslint-disable-next-line no-param-reassign
      world[rowY] |= row;
    }
  });
};

/**
 * Drop rocks until the stop condition is met.
 * Returns an array representing the state of the room.
 */
const dropRocks = (input, rockStoppedCallback) => {
  const rockIterator = loopingIterator(rockTemplates);
  const jetIterator = loopingIterator(parseInput(input));
  const world = [];
  for (;;) {
    const rock = spawnRock(world.length, rockIterator());
    const stopped = moveRockUntilStops(rock, world, jetIterator);
    mergeRockIntoWorld(stopped, world);
    // simulate until callback explicitly returns false.
    if (rockStoppedCallback(world) === false) {
      break;
    }
  }
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  let dropCount = 0;
  let height = 0;
  dropRocks(lines[0], (world) => {
    height = world.length;
    return ++dropCount !== 2022;
  });
  return height;
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  /**
   * Checks to see if the cycle of rock patterns repeats through the end of the world.
   */
  const cycleRepeats = (world, startIndex, cycleLength) => {
    // bail if cycle length is larger than than remaining items in array.
    if (world.length - (startIndex + cycleLength) < cycleLength) {
      return false;
    }
    // ensure each item in the cycle repeats until the end of the array.
    // allow incomplete cycles at the tail of the array.
    for (let i = 0; i < cycleLength; i++) {
      let skipIndex = startIndex + i + cycleLength;
      while (skipIndex < world.length) {
        if (world[i + startIndex] !== world[skipIndex]) {
          return false;
        }
        skipIndex += cycleLength;
      }
    }
    return true;
  };

  /**
   * Search the world and detect if a repeating cycle of rocks has formed.
   * Returns null if no cycle is found
   */
  const findCycle = (world) => {
    for (let i = 0; i < world.length; i++) {
      // only search while potential cycle length is smaller than remaining elements.
      const searchEnd = Math.floor((world.length - i) / 2) + i;
      for (let j = i + 1; j < searchEnd; j++) {
        if (world[i] === world[j] && cycleRepeats(world, i, j - i)) {
          return {
            startHeight: i + 1,
            endHeight: j + 1,
          };
        }
      }
    }
    return null;
  };

  /**
   * Calculates and returns information about the repeating cycle the world settled into.
   */
  const calculateCycleInformation = ({ startHeight, endHeight }, heightHistory) => {
    const startRockIndex = heightHistory.findIndex((height) => height >= startHeight);
    const endRockIndex = heightHistory.findIndex((height) => height >= endHeight);
    const heightOffsets = [];
    for (let rockIndex = startRockIndex; rockIndex <= endRockIndex; rockIndex++) {
      heightOffsets.push(heightHistory[rockIndex] - startHeight);
    }
    return {
      predecessorRockCount: startRockIndex + 1,
      rockCount: endRockIndex - startRockIndex,
      startHeight,
      heightOffsets,
      totalHeight: endHeight - startHeight,
    };
  };

  /**
   * Continually drops rocks until the world settles into a repeating cycle.
   * Returns information about the cycle.
   */
  const dropUntilCycle = (input) => {
    const heightHistory = [];
    let cycle = null;

    dropRocks(input, (world) => {
      heightHistory.push(world.length);
      // check for a cycle every 1000 rocks.
      if (heightHistory.length % 1000 === 0) {
        cycle = findCycle(world);
      }
      // continue dropping if cycle is not found.
      return cycle === null;
    });

    return calculateCycleInformation(cycle, heightHistory);
  };

  return ({ lines }) => {
    const cycle = dropUntilCycle(lines[0]);
    const numberOfRocks = 1_000_000_000_000 - cycle.predecessorRockCount;
    const numberOfCycles = Math.floor(numberOfRocks / cycle.rockCount);
    const incompleteCycles = numberOfRocks % cycle.rockCount;
    return (
      cycle.startHeight +
      numberOfCycles * cycle.totalHeight +
      cycle.heightOffsets[incompleteCycles]
    );
  };
})();
