/**
 * Contains solutions for Day 17
 * Puzzle Description: https://adventofcode.com/2022/day/17
 */

import { loopingIterator, range } from './util/array.js';
import { Vector2, add, equals, left, right } from './util/vector2.js';
import { isBitSet, leftShift, rightShift } from './util/bitwise.js';
import { inRange } from './util/math.js';

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
 * The chamber is 7 units wide, when bit packing a horizontal slice of the chamber
 * the max possible zero based index is 6.
 */
const maxChamberIndex = 6;

/**
 * Parse the input and return a looping iterator of jet blast functions.
 */
const parseInput = (input) =>
  loopingIterator([...input].map((x) => (x === '<' ? leftShift : rightShift)));

/**
 * Returns true if the point at the x position in the row is not empty space.
 */
const pointIsOccupied = (points, x) => isBitSet(points, maxChamberIndex - x);

/**
 * Returns true if the right most point in the row is touching the right wall of the chamber.
 */
const touchingRightWall = (points) => pointIsOccupied(points, maxChamberIndex);

/**
 * Returns true if any points in the row collide.
 */
const rowsCollide = (lhs, rhs) => (lhs & rhs) !== 0;

/**
 * Spawns the rock template so its bottom edge is 3 units above the highest rock in the room.
 */
const spawnRock = (highestRockY, rockTemplate) => ({
  y: highestRockY + 3 + rockTemplate.length - 1,
  points: [...rockTemplate],
});

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const jetBlastIterator = parseInput(lines[0]);
  const stoppedRocks = [];
  

  console.log(jetBlastIterator());
  console.log(jetBlastIterator());
  console.log(jetBlastIterator());
  console.log(jetBlastIterator());

  // const world = [0b0011110, 0b0001000, 0b0011100, 0b0001000];
  const world = [];
  const rock = spawnRock(world.length, rockTemplates[0]);

  // print(world, rock);
  return 3127;
};

// /**
//  * Must redefine "down" for this world, the vector2 util defines (0,0) as top left.
//  * This puzzle is easier if we define (0,0) as bottom left.
//  */
// const down = new Vector2(0, -1);

// /**
//  * Defines the shape of each rock that falls and the order they fall in.
//  */
// const rockTemplates = [
//   {
//     // ####
//     points: [new Vector2(0, 0), new Vector2(1, 0), new Vector2(2, 0), new Vector2(3, 0)],
//     topIndex: 0,
//   },
//   {
//     // .#.
//     // ###
//     // .#.
//     points: [
//       new Vector2(1, 0),
//       new Vector2(0, 1),
//       new Vector2(1, 1),
//       new Vector2(2, 1),
//       new Vector2(1, 2),
//     ],
//     topIndex: 4,
//   },
//   {
//     // ..#
//     // ..#
//     // ###
//     points: [
//       new Vector2(2, 2),
//       new Vector2(2, 1),
//       new Vector2(0, 0),
//       new Vector2(1, 0),
//       new Vector2(2, 0),
//     ],
//     topIndex: 0,
//   },
//   {
//     // #
//     // #
//     // #
//     // #
//     points: [new Vector2(0, 0), new Vector2(0, 1), new Vector2(0, 2), new Vector2(0, 3)],
//     topIndex: 3,
//   },
//   {
//     // ##
//     // ##
//     points: [new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1), new Vector2(1, 1)],
//     topIndex: 3,
//   },
// ];

// /**
//  * The extreme x and y scalar values of the chamber.
//  */
// const chamberBounds = {
//   left: 0,
//   right: 6,
//   bottom: 0,
// };

// /**
//  * Returns a new rock with the movement applied.
//  */
// const moveRock = (rock, movement) => rock.map((position) => add(position, movement));

// /**
//  * Returns a new rock moved one unit to the right.
//  */
// const moveRockRight = (rock) => moveRock(rock, right);

// /**
//  * Returns a new rock moved one unit to the left.
//  */
// const moveRockLeft = (rock) => moveRock(rock, left);

// /**
//  * Returns a new rock moved one unit down.
//  */
// const moveRockDown = (rock) => moveRock(rock, down);

// /**
//  * Parse the input and return the jet movement functions.
//  */
// const parseInput = (input) =>
//   [...input].map((character) => (character === '>' ? moveRockRight : moveRockLeft));

// /**
//  * Returns true if the position will collide with the right side of the chamber.
//  */
// const collidesWithRightWall = ({ x }) => x > chamberBounds.right;

// /**
//  * Returns true if the position will collide with the left side of the chamber.
//  */
// const collidesWithLeftWall = ({ x }) => x < chamberBounds.left;

// /**
//  * Returns true if any point of the rock will collide with a left or right wall.
//  */
// const collidesWithWalls = (rock) =>
//   rock.some(
//     (position) => collidesWithLeftWall(position) || collidesWithRightWall(position)
//   );

// /**
//  * Returns true if any point of the rock will collide with the floor.
//  */
// const collidesWithFloor = (rock) => rock.some(({ y }) => y < chamberBounds.bottom);

// /**
//  * Returns true if the rock intersects with any rock at rest.
//  */
// const intersectsWithAnyRockAtRest = (rock, rocksAtRest) =>
//   rock.some((position) => rocksAtRest.has(position.toString()));

// /**
//  * Spawns a new rock at the spawn point defined by the highest Y.
//  */
// const spawnRock = (highestY, rockTemplate) =>
//   moveRock(rockTemplate, new Vector2(2, highestY + 4));

// const print = (() => {
//   const border = '+-------+';

//   /**
//    * Returns true if the position intersect with any point of the rock.
//    */
//   const positionIntersectsRock = (position, rock) =>
//     rock.some((rockPosition) => equals(position, rockPosition));

//   const positionIntersectsAnyRock = (position, rocks) =>
//     rocks.some((rock) => positionIntersectsRock(position, rock));

//   const renderRow = (y, fallingRock, rocksAtRest) => {
//     let row = '';
//     const position = new Vector2(0, y);
//     while (position.x <= chamberBounds.right) {
//       let toRender = '.';
//       if (positionIntersectsRock(position, fallingRock)) {
//         toRender = '@';
//       } else if (positionIntersectsAnyRock(position, rocksAtRest)) {
//         toRender = '#';
//       }
//       row += toRender;
//       position.x += 1;
//     }
//     return `|${row}|`;
//   };

//   return (rowStart, rowEnd, fallingRock, rocksAtRest) => {
//     console.log();
//     console.log(`${border}`);
//     range(rowEnd - rowStart, rowStart)
//       .map((y) => renderRow(y, fallingRock, rocksAtRest))
//       .reverse()
//       .forEach((line, index, lines) =>
//         console.log(`${line} - ${lines.length - index - 1 + rowStart}`)
//       );
//     console.log(`${border}`);
//   };
// })();

// /**
//  * Returns a function that can be used to detect if the rock collides
//  * with the walls, floor or other rocks.
//  */
// const getRockCollisionFunction = (rocks) => (rock) =>
//   collidesWithWalls(rock) ||
//   collidesWithFloor(rock) ||
//   intersectsWithAnyRockAtRest(rock, rocks);

// /**
//  * Applies the movement function to the rock, then checks the collision function.
//  * If the collision function returns false then the new position is returned.
//  * If the collision function returns true, then false is returned, indicating the rock cannot move.
//  */
// const attemptToMoveRock = (rock, movementFn, collisionFn) => {
//   const newRock = movementFn(rock);
//   return !collisionFn(newRock) ? newRock : rock;
// };

// const fallRockUntilAtRest = (fallingRock, rocksAtRest, getNextJetBlastFn) => {
//   let currentRock = fallingRock;

//   for (;;) {
//     const collisionFn = getRockCollisionFunction(rocksAtRest);

//     const afterJetBlast = attemptToMoveRock(
//       currentRock,
//       getNextJetBlastFn(),
//       collisionFn
//     );

//     const afterDrop = attemptToMoveRock(afterJetBlast, moveRockDown, collisionFn);

//     if (afterJetBlast === afterDrop) {
//       return afterDrop;
//     }

//     currentRock = afterDrop;
//   }
// };

// const solve = (numberOfRocks, input) => {
//   const getNextJetBlast = loopingIterator(parseInput(input));
//   const getNextRock = loopingIterator(rockTemplates);
//   const rocksAtRest = new Set(
//     fallRockUntilAtRest(
//       spawnRock(-1, getNextRock().points),
//       new Set(),
//       getNextJetBlast
//     ).map((x) => x.toString())
//   );
//   let highestY = 0;
//   let remainingRocks = numberOfRocks - 1;

//   while (remainingRocks--) {
//     const rockTemplate = getNextRock();
//     const newRock = fallRockUntilAtRest(
//       spawnRock(highestY, rockTemplate.points),
//       rocksAtRest,
//       getNextJetBlast
//     );
//     highestY = Math.max(highestY, newRock[rockTemplate.topIndex].y);
//     newRock.forEach((point) => {
//       rocksAtRest.add(point.toString());
//     });
//   }

//   return highestY + 1;
// };

// /**
//  * Performance improvements:
//  * Batch settled rocks into array of sets, check "higher" sets first as a higher collision is more likely.
//  * Change storage of settled rocks, array of 8 bit numbers as flags, allows o(1) check to see if position is occupied.
//  *  will make detecting loops easier for level 2.
//  */

// /**
//  * Returns the solution for level one of this puzzle.
//  */
// export const levelOne = ({ lines }) => solve(2022, lines[0]);

// /**
//  * Returns the solution for level two of this puzzle.
//  */
// export const levelTwo = ({ input, lines }) => {
//   // your code here
// };
